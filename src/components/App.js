import React from "react";
import Header from "./Header";
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import CurrentUserContext from "../contexts/CurrentUserContext";
import api from '../utils/api';
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";

function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);

  React.useEffect(() => {
    api.getUserInfo()
    .then((res) => {
        setCurrentUser(res);
    })
    .catch(err => {
        console.log(err);
    });

    api.getInitialCards()
    .then((res) => {
        setCards(res);
    })
    .catch(err => {
        console.log(err);
  });
}, []);

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
  }
  
  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
  }

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  }

  const handleCardClick = (card) => {
    setIsImagePopupOpen(!isImagePopupOpen);
    setSelectedCard(card);
  }

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsImagePopupOpen(false);
  }

  const handleCardLike = (card) => {
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    if(isLiked) {
      api.deleteLike(card._id)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch(err => {
        console.log(err);
      });
    } else {
      api.addLike(card._id)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch(err => {
        console.log(err);
      });
    }
  }

  const handleCardDelete = (card) => {
    api.deleteCard(card._id)
    .then(() => {
      setCards((state) => state.filter((item) => card._id !== item._id));
    })
    .catch(err => {
      console.log(err);
    });
  }

  const handleUpdateUser = (user) => {
    api.editProfile(user.name, user.about)
    .then((res) => {
      setCurrentUser(res);
      closeAllPopups();
    })
    .catch(err => {
      console.log(err);
    });
  }

  const handleUpdateAvatar = (link) => {
    api.editAvatar(link)
    .then((res) => {
      setCurrentUser(res);
      closeAllPopups();
    })
    .catch(err => {
      console.log(err);
    });
  }

  const handleAddPlaceSubmit = (card) => {
    api.addNewCard(card.title, card.link)
    .then((newCard) => {
      setCards([newCard, ...cards]);
      closeAllPopups();
    })
    .catch(err => {
      console.log(err);
    });
  }

  return (
    <CurrentUserContext.Provider value = {currentUser}>
      <div>
          <Header/>
          <Main
            cards = {cards}
            onEditProfile = {handleEditProfileClick}  
            onAddPlace = {handleAddPlaceClick}
            onEditAvatar = {handleEditAvatarClick}
            onCardClick = {handleCardClick}
            onCardLike = {handleCardLike}
            onCardDelete = {handleCardDelete}
          />

          <ImagePopup onClose = {closeAllPopups} isOpen = {isImagePopupOpen} card = {selectedCard} />

          <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} /> 

          <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />

          <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />

          <PopupWithForm name = "delete" title = "Вы уверены?" buttonText = "Да" onClose = {closeAllPopups} />

          <Footer/>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
