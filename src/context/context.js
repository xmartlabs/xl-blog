// Context.js
import React from "react";

const defaultContextValue = {
  data: {
    // set your initial data shape here
    menuOpen: false,
  },
  setData: () => {},
}

const AppContext = React.createContext(defaultContextValue)

class AppContextProviderComponent extends React.Component {
  constructor() {
    super()

    this.setData = (newData)=> {
      const freshData = {
        ...this.state.data,
        ...newData,
      }
      localStorage.setItem("global-state", JSON.stringify(freshData))
      this.setState(state => (
        {
          data: {
            ...state.data,
            ...newData,
          },
        }))
    }

    this.state = {
      ...defaultContextValue,
      setData: this.setData,
    }
  }

  render() {
    return <AppContext.Provider value={this.state}>{this.props.children}</AppContext.Provider>
  }

  componentDidMount() {
    // Getting dark mode value from localStorage!
    const global_state = JSON.parse(localStorage.getItem("global-state"))
    if (global_state) {
      this.setData(global_state)
    } else {
      this.setData({ })
    }
  }

}

export { AppContext as default, AppContextProviderComponent }
