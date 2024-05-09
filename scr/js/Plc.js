import { stringToBool } from './helpers';
import { isMobile } from './utils';

const dataAttributePlc = '[data-plc-type]';

class Plc {
  constructor(hasReload = true, reloadTime = 1000, format = false, log = false) {
    this.file_reading_variables = 'variabili-lettura.htm';
    this.file_writing_variables = 'variabili-scrittura.htm';
    this.hasReload = hasReload;
    this.reloadTime = reloadTime;
    this.log = log;
    this.plcElements = document.querySelectorAll(dataAttributePlc);

    this.format = format;

    this.fetchInProgress = false;

    this.variables = {};
  }

  init() {
    // bind events
    this.eventBind();

    // inject
    this.reload();
  }

  formatter() {
    const float2Points = [
      'jointPosition1',
      'jointPosition2',
      'jointPosition3',
      'jointPosition4',
      'jointPosition5',
      'jointPosition6',
      'jointVelocity1',
      'jointVelocity2',
      'jointVelocity3',
      'jointVelocity4',
      'jointVelocity5',
      'jointVelocity6',
      'jointCurrent1',
      'jointCurrent2',
      'jointCurrent3',
      'jointCurrent4',
      'jointCurrent5',
      'jointCurrent6',
      'jointTemperature1',
      'jointTemperature2',
      'jointTemperature3',
      'jointTemperature4',
      'jointTemperature5',
      'jointTemperature6',
    ];
    float2Points.forEach((el) => {
      this.variables[el] = parseFloat(this.variables[el])
          .toFixed(2);
    });

    if (this.variables.matchState == 1) {
      this.variables.matchState = 'In corso';
    } else {
      this.variables.matchState = 'Finita';
    }
  }

  /**
   * variables setter
   * @param {object} obj
   */
  setVariables(obj) {
    this.variables = obj;

    if (this.format) {
      this.formatter();
    }
  }

  getValues(fileReadingVariables) {
    fetch(fileReadingVariables)
        .then((response) => response.json())
        .then((json) => {
          this.setVariables(json);
          this.fetchInProgress = false;
          if (this.log) {
            console.log(this.variables);
          }
        });
  }

  getValue(variable) {
    return this.variables[variable];
  }

  /**
   * bind all events with data attributes
   */
  eventBind() {
    const self = this;
    // filter the elements for output
    [...this.plcElements]
        .filter((el) => el.dataset.plcType === 'write')
        .forEach((el) => {
          switch (el.dataset.plcInputType) {
            case ('value'):
              el.addEventListener('click', (e) => {
                e.preventDefault();
                const variable = el.dataset.plcVariable;
                self.post(variable, e.target.dataset.plcInputValue);
              });
              break;
            case ('toggle'):
              el.addEventListener('click', (e) => {
                e.preventDefault();
                const variableJs = el.dataset.plcVariableJs;
                const variablePlc = el.dataset.plcVariable;
                const value = stringToBool(self.variables[variableJs]);
                self.post(variablePlc, !value);
              });
              break;
            case ('press'):
              if (isMobile()) {
                el.addEventListener('touchstart', (e) => {
                  e.preventDefault();
                  const variable = el.dataset.plcVariable;
                  self.post(variable, true);
                });
                el.addEventListener('touchend', (e) => {
                  e.preventDefault();
                  const variable = el.dataset.plcVariable;
                  self.post(variable, false);
                });
              } else {
                el.addEventListener('mousedown', (e) => {
                  e.preventDefault();
                  const variable = el.dataset.plcVariable;
                  self.post(variable, true);
                });
                el.addEventListener('mouseup', (e) => {
                  e.preventDefault();
                  const variable = el.dataset.plcVariable;
                  self.post(variable, false);
                });
              }
              break;
            default:
              console.log('default');
          }
        });
  }

  /**
   * Reload the page
   */
  reload() {
    const self = this;
    window.addEventListener('load', () => {
      setInterval(() => {
        if (self.hasReload && !self.fetchInProgress) {
          self.fetchInProgress = true;
          self.getValues(self.file_reading_variables);
          self.fetchAndInject();
        }
      }, this.reloadTime);
    });
  }

  /**
   * get the data from the file with the variables and inject in dom
   */
  fetchAndInject() {
    [...this.plcElements]
        .filter((el) => el.dataset.plcType === 'read')
        .forEach((el) => {
          if (el.dataset.plcVariableJs) {
            switch (el.dataset.plcOutputType) {
              case ('led'):
                // FIXME: led che si accende se value a 1
                el.classList.add('led');
                if (this.variables[el.dataset.plcVariableJs]) {
                  el.classList.add('is-active');
                } else {
                  el.classList.remove('is-active');
                }
                break;
              default:
                // TODO: fare con appendChild
                el.innerHTML = this.variables[el.dataset.plcVariableJs];
            }
          }
        });
  }

  post(variable, value = null) {
    // console.log(variable + ' <- ' + value);
    const httpRequest = new XMLHttpRequest();
    httpRequest.open('POST', this.file_writing_variables);
    httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    httpRequest.send(variable + '=' + encodeURIComponent(value));
  }
}

export default Plc;
