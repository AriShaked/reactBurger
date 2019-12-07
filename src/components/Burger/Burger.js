import React from 'react';

import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => {

    let transformedIngredients = Object.keys(props.ingredients)
    .map(ingkey => {
        return [...Array(props.ingredients[ingkey])].map((_ ,i) => {
            return <BurgerIngredient key={ingkey+i} type={ingkey}/>
        } )
    })
    .reduce((arr ,el) => {
        return arr.concat(el)
    } , []) 
    console.log(transformedIngredients)

    if (transformedIngredients.length === 0) {
        transformedIngredients = <p>Please start adding ingredients!</p>
    }

  return (
    <div className={classes.Burger}>
      <BurgerIngredient type={'bread-top'}/>
        {transformedIngredients}
      <BurgerIngredient type={'bread-bottom'}/>
    </div>
  );
};

export default burger;

