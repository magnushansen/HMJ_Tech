// components/CardLayout.tsx

import React from 'react';
import Card from './Cards';
import styles from './CardLayout.module.css';

const suits = ['spades', 'clubs', 'diamonds', 'hearts'];
const ranks = [ '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
const imageName = `${ranks}_of_${suits}.png`;

const CardLayout: React.FC = () => {
  return (
    <div className={styles.layout}>
      {suits.map((suit) =>
        ranks.map((rank) => (
          <Card key={`${rank}${suit}`} rank={rank} suit={suit} />
        ))
      )}
    </div>
  );
};
// 
export default CardLayout;
