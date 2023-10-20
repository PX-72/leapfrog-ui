import { createRoot } from 'react-dom/client';
import { App } from './App';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const theme = {
  fontColor: '#FAFAFA',
  backgroundColor: '#09090B',
  separatorBorder: '1px solid #464343',
  selectedBackgroundColor: '#f38e11',

  button: {
    color: '#c4ced7',
    hoverColor: '#d9e1ea',
    background: '#035CC8',
    dangerBackground: '#d03902',
    hoverBackground: '#01479d',
    dangerHoverBackground: '#a52c00',
  },

  panel: {
    backgroundColor: '#27272A',
    borderRadius: '0.5rem',
    padding: '1.2rem',
    margin: '0.5rem'
  },

  scrollbar: {
    backgroundColor: '#2d2d2d',
    thumbColor: '#868b8e',
    thumbHoverColor: '#818f91'
  }
};

const GlobalStyle = createGlobalStyle`
    *,
    *::before,
    *::after,
    html {
        box-sizing: border-box;
        line-height: 1.15;
        outline-style: none;
        box-shadow: none;
        border-color: transparent;
    }

    body {
        margin: 0;
        padding: 0;
        min-height: 100vh;
        background-color: ${(props) => props.theme.backgroundColor};
        color: ${(props) => props.theme.fontColor};
        font-family: Roboto, 'Segoe UI', Helvetica, Arial, sans-serif;
    }

    ::-webkit-scrollbar {
      width: 8px;
      border-radius: 5px;
      background-color: ${(props) => props.theme.scrollbar.backgroundColor};
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 5px;
      border: 1px solid transparent;
      background-clip: content-box;
      background-color: ${(props) => props.theme.scrollbar.thumbColor};
    }

    ::-webkit-scrollbar-thumb:hover {
      background-color: ${(props) => props.theme.scrollbar.thumbHoverColor};
    }
`;

const container = document.querySelector('#app')!;
createRoot(container).render(
  <>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <App />
    </ThemeProvider>
    <ToastContainer limit={3} newestOnTop />
  </>
);
