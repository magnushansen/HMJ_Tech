// components/CardLayout.tsx

import React from 'react';
import Card from './Cards';
import styles from './CardLayout.module.css';

const suits = ['♠', '♥', '♦', '♣'];
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

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

export default CardLayout;
