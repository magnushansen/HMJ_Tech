// components/CardLayout.tsx

import React from 'react';
import Card from './Cards';
import styles from './CardLayout.module.css';

const suits = ['spades', 'hearts', 'diamonds', 'spades'];
const ranks = ['ace', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
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
