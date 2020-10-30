import React, { useState, useEffect } from 'react'
import './app.scss'

function App() {

  const [flyer, setFlyer] = useState([])
  const [favorites, setFavorites] = useState([])
  const [menu, setMenu] = useState(false)

  const handleMenu = e => {!menu ? setMenu(true) : setMenu(false)}

  const handleFavorites = e => {
    const idToAdd = Number(e.target.dataset.id)
     if(favorites.includes(idToAdd)){
       //remove from state and localstorage
       const newFavorites = favorites.filter(item => item !== idToAdd)
       setFavorites(newFavorites)
       localStorage.setItem('favorites',newFavorites)
    }else{
      //add to state and to localstorage
      favorites.push(idToAdd)
      setFavorites([...favorites])
      localStorage.setItem('favorites',[...favorites])
    }
  }

  useEffect(() => {
    //call api get flyers
    fetch('/api/flyers?page=1&limit=100')
      .then(res => res.json())
      .then(flyer => setFlyer(flyer.flyersData))// todo add is favorite
    //if have favorites in localstorage get it and add to state
    if(localStorage.getItem('favorites') !== null){
      const stringToArray = Array.from(localStorage.getItem('favorites').split(','),Number)
      setFavorites(favorites => [...favorites, ...stringToArray])
    }
  }, []);

  return (
    <>
      <header className="header">
        <button className="btn material-icons btn_menu" onClick={handleMenu}>menu</button>
        ShopFully
      </header>

      <nav className={"menu " + (menu ? 'd-block' : 'd-none')}>
        <div className="menu-wrapper overflow-auto">
          <div className="material-icons avatar pl-3">account_circle</div>
          <h5 className="font-weight-bold px-3">Favourites</h5>
          <p className="px-3 pb-3 border-bottom">the list of your preferred flyers</p>
          <ul className="px-2 py-3">
          {flyer.map(item => (
            <li className={"p-2 " + (favorites.includes(Number(item.id)) ? 'd-block' : 'd-none')} key={item.id}>
                <div className="material-icons position-absolute">favorite</div>
                <div className="pl-5">{item.title}</div>
            </li>
          ))}
          </ul>
        </div>
        <div className="menu-overlay" onClick={handleMenu}></div>
      </nav>

      <main>
        <div className="wrapper">
          <ul className="cards">
            {flyer.map(item => (
              <li className="card shadow" key={item.id}>
                <img className="card-img-top" src={item.img ? item.img : 'https://via.placeholder.com/200x130'} alt={item.title}/>
                <div className="card-body pb-0">
                  <small>{item.retailer}</small>
                  <h5 className="card-title mb-0">{item.title}</h5>
                  <p classname="card-text">{item.category}</p>
                </div>
                <div className="card-footer border-0 px-2 bg-white">
                  <button className={"btn material-icons " + (favorites.includes(Number(item.id)) ? 'favorite' : 'not-favorite')} data-id={item.id} onClick={handleFavorites}>favorite</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>

    </>
  )
}

export default App;