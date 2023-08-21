import React, { useState, useEffect } from "react";
import Card from "./Card";
import "./Deck.css";
import axios from "axios";

let URL = "https://deckofcardsapi.com/api/deck";

function Deck() {
  let [deck, setDeck] = useState(null);
  let [drawnCard, setDrawnCard] = useState([]);
  let [shuffling, setShuffling] = useState(false);

  useEffect(function getDeck() {
    async function getData() {
      let data = await axios.get(`${URL}/new/shuffle`);
      console.log(data);
      setDeck(data.data);
    }
    getData();
  }, []);

  async function draw() {
    try {
      let drawResp = await axios.get(`${URL}/${deck.deck_id}/draw/`);

      if (drawResp.data.remaining === 0) {
        throw new Error("No cards left in deck");
      }

      let card = drawResp.data.cards[0];

      setDrawnCard((d) => [
        ...d,
        {
          id: card.code,
          name: card.suit + " " + card.value,
          image: card.image,
        },
      ]);
    } catch (e) {
      alert(e);
    }
  }

  async function startShuffle() {
    setShuffling(true);

    try {
      await axios.get(`${URL}/${deck.deck_id}/shuffle/`);
      setDrawnCard([]);
    } catch (e) {
      alert(e);
    } finally {
      setShuffling(false);
    }
  }

  function drawBtn() {
    if (!deck) {
      return null;
    }

    return (
        <button
        className="Deck-get"
        onClick={draw}
        disabled={shuffling}>
            Draw Card
        </button>
    )
  }

  function shuffleBtn(){
    if (!deck) {
        return null;
      }
  
      return (
          <button
          className="Deck-get"
          onClick={startShuffle}
          disabled={shuffling}>
              Shuffle
          </button>
      )
  }

  return(
    <div className="Deck">
      <div className="Deck-cardarea">{
        drawnCard.map(c => (
          <Card key={c.id} name={c.name} image={c.image} />
        ))}
      </div>
      {drawBtn()}
      {shuffleBtn()}
    </div>
  )
}

export default Deck;
