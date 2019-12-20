import React from 'react'
import Web3ContextProvider from './components/Web3ContextProvider';
import Footer from './components/Footer';
import Header from './components/Header';
import Routing from './components/Routing'
import ContractsDataContextProvider from './components/ContractsDataContextProvider';
import { Messages } from './components/Message';
import { SideMenu, SiedMenuProvider } from './components/SideMenu';
import { BrowserRouter as Router } from 'react-router-dom'

const App = () => (
  <Messages>
    <Web3ContextProvider>
      <ContractsDataContextProvider>
        <SiedMenuProvider>
          <Router>
            <div className='main'>
              <Header />
              <SideMenu />
              <div className='content'>
                <Routing />
                <Footer />
              </div>
            </div>
          </Router>
        </SiedMenuProvider>
      </ContractsDataContextProvider>
    </Web3ContextProvider>
  </Messages>
)

export default App