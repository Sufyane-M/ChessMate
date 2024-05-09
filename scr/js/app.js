import '../scss/app.scss';
import { setVariableScrollbarWidth } from './utils';
import Plc from './Plc';

const RELOAD_TIME = 200;

const initApp = () => {
  // Setup
  setVariableScrollbarWidth();

  if (document.querySelector('[data-plc]')) {
    console.log('PLC');
    const plc = new Plc(true, RELOAD_TIME, true, true);
    // plc.formatter((variables) => {
    //   console.log(variables);
    // });
    plc.init();

    setInterval(() => {
      // Read PLC variables and history
      const history = document.querySelector('.history');
      if (history) {
        let historyHtml = '';
        historyHtml += '<div>' + plc.variables.storicoMosse1 + '</div>';
        historyHtml += '<div>' + plc.variables.storicoMosse2 + '</div>';
        historyHtml += '<div>' + plc.variables.storicoMosse3 + '</div>';
        historyHtml += '<div>' + plc.variables.storicoMosse4 + '</div>';
        historyHtml += '<div>' + plc.variables.storicoMosse5 + '</div>';
        historyHtml += '<div>' + plc.variables.storicoMosse6 + '</div>';
        historyHtml += '<div>' + plc.variables.storicoMosse7 + '</div>';
        historyHtml += '<div>' + plc.variables.storicoMosse8 + '</div>';
        historyHtml += '<div>' + plc.variables.storicoMosse9 + '</div>';
        historyHtml += '<div>' + plc.variables.storicoMosse10 + '</div>';

        history.innerHTML = historyHtml;
      }

      // Read PLC variables and create matrix
      const matrice = getMatriceFromPlc(plc);
      const scacchiera = document.querySelector('.chess-board');
      if (scacchiera) {
        aggiornaScacchiera(scacchiera, matrice);
      }
    }, RELOAD_TIME);
  }

  document.addEventListener('resize', () => {
    if (document.window.innerWidth > 1190) {
      document.querySelector('.sidebar')
        .classList
        .remove('collapse');
    } else {
      document.querySelector('.sidebar')
        .classList
        .add('collapse');
    }
  });

  document.querySelectorAll('.logo, .logo-expand, .discover')
    .forEach((el) => {
      el.addEventListener('click', (e) => {
        document.querySelector('.main-container')
          .classList
          .remove('show');
        document.querySelector('.main-container')
          .scrollTop = 0;
      });
    });

  const trendingEls = document.querySelectorAll('.trending');
  if (trendingEls.length > 0) {
    trendingEls.forEach((el) => {
      el.addEventListener('click', (e) => {
        document.querySelector('.main-container')
          .classList
          .add('show');
        document.querySelectorAll('.sidebar-link')
          .forEach((elSidebarLink) => {
            elSidebarLink.classList
              .remove('is-active');
          });
        document.querySelector('.trending')
          .classList
          .add('is-active');
      });
    });
  }

  //dropdown-select
  const dropdownSelectEls = document.querySelectorAll('.dropdown-select');
  if (dropdownSelectEls.length > 0) {
    dropdownSelectEls.forEach((el) => {
      el.addEventListener('click', function (e) {
        e.target.toggleClass('expanded');
        e.stopPropagation();

        const elsFor = document.querySelectorAll('#' + e.target.getAttribute('for'));
        if (elsFor.count() > 0) {
          elsFor.forEach((elFor) => {
            elFor.toggleClass('expanded');
          });
        }
      });
    });
  }

  document.addEventListener('click', function (e) {
    const dropdownEls = document.querySelectorAll('.dropdown-el');
    if (dropdownEls.length > 0) {
      dropdownEls.forEach((el) => {
        el.classList.remove('expanded');
      });
    }
  });

  function aggiornaScacchiera(scacchiera, matrice) {
    const MAPPING_CELLS = {
      2: '♜',
      3: '♞',
      4: '♝',
      6: '♛',
      5: '♚',
      1: '♟',
      12: '♖',
      13: '♘',
      14: '♗',
      16: '♕',
      15: '♔',
      11: '♙',
      0: '',
      undefined: '',
    };

    matrice.forEach((riga, i) => {
      riga.forEach((pezzo, j) => {
        const cella = scacchiera.querySelector(`#board-${String.fromCharCode(97 + i)}${1 + j}`);
        cella.innerHTML = MAPPING_CELLS[pezzo];
      });
    });
  }

  function getMatriceFromPlc(plc) {
    return [
      [plc.variables.casella1, plc.variables.casella2, plc.variables.casella3, plc.variables.casella4, plc.variables.casella5, plc.variables.casella6, plc.variables.casella7, plc.variables.casella8],
      [plc.variables.casella9, plc.variables.casella10, plc.variables.casella11, plc.variables.casella12, plc.variables.casella13, plc.variables.casella14, plc.variables.casella15, plc.variables.casella16],
      [plc.variables.casella17, plc.variables.casella18, plc.variables.casella19, plc.variables.casella20, plc.variables.casella21, plc.variables.casella22, plc.variables.casella23, plc.variables.casella24],
      [plc.variables.casella25, plc.variables.casella26, plc.variables.casella27, plc.variables.casella28, plc.variables.casella29, plc.variables.casella30, plc.variables.casella31, plc.variables.casella32],
      [plc.variables.casella33, plc.variables.casella34, plc.variables.casella35, plc.variables.casella36, plc.variables.casella37, plc.variables.casella38, plc.variables.casella39, plc.variables.casella40],
      [plc.variables.casella41, plc.variables.casella42, plc.variables.casella43, plc.variables.casella44, plc.variables.casella45, plc.variables.casella46, plc.variables.casella47, plc.variables.casella48],
      [plc.variables.casella49, plc.variables.casella50, plc.variables.casella51, plc.variables.casella52, plc.variables.casella53, plc.variables.casella54, plc.variables.casella55, plc.variables.casella56],
      [plc.variables.casella57, plc.variables.casella58, plc.variables.casella59, plc.variables.casella60, plc.variables.casella61, plc.variables.casella62, plc.variables.casella63, plc.variables.casella64],
    ];
  }
};

/**
 * Ready with support for IE
 * https://stackoverflow.com/q/63928043/1252920
 */
if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
  initApp();
} else {
  document.addEventListener('DOMContentLoaded', initApp);
}

const mod1 = document.querySelector('.modalita-cover-1');
const mod2 = document.querySelector('.modalita-cover-2');
const mod3 = document.querySelector('.modalita-cover-3');
mod1.addEventListener('click', () => {
  if (mod2.classList.contains('special')) {
    mod2.classList.remove('special');
    mod1.classList.toggle('special');
  } else if (mod3.classList.contains('special')) {
    mod3.classList.remove('special');
    mod1.classList.toggle('special');
  } else {
    mod1.classList.toggle('special');
  }
});

mod2.addEventListener('click', () => {
  if (mod1.classList.contains('special')) {
    mod1.classList.remove('special');
    mod2.classList.toggle('special');
  } else if (mod3.classList.contains('special')) {
    mod3.classList.remove('special');
    mod2.classList.toggle('special');
  } else {
    mod2.classList.toggle('special');
  }
});
mod3.addEventListener('click', () => {
  if (mod1.classList.contains('special')) {
    mod1.classList.remove('special');
    mod3.classList.toggle('special');
  } else if (mod2.classList.contains('special')) {
    mod2.classList.remove('special');
    mod3.classList.toggle('special');
  } else {
    mod3.classList.toggle('special');
  }
});
