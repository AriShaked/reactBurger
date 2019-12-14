import React , {Component} from 'react';

import Auxillary from '../../hoc/Auxillary/Auxillary';
import Burger from '../../components/Burger/Burger';
import BuildControls from './../../components/Burger/BuildControls/BuildControls';
import Modal from './../../components/UI/Modal/Modal';
import OrderSummary from './../../components/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/spinner/spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

import axios from '../../axios-orders';


const INGREDIENT_PRICES = {
    salad: 0.5 ,
    cheese: 0.4 ,
    meat: 1.3 ,
    bacon: 0.7
}

class BurgerBuilder extends Component {

    state = {
        ingredients :{
            salad: 0 ,
            bacon: 0 ,
            cheese: 0 ,
            meat : 0 
        } , 
        totalPrice : 4 ,
        purchaseable: false,
        purchasing: false,
        loading: false ,
        error: false
    }
    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients)
            .map(ingrKey => {
                return ingredients[ingrKey];
            })
            .reduce((sum , el) => {
                return sum + el
            }, 0);
         this.setState({purchaseable: sum > 0})   
    }

    addIngredientHandler = (type) =>  {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice: newPrice , ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler= (type) =>  {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0 ) {
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDedution = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDedution;
        this.setState({totalPrice: newPrice , ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients)
    }

    purchaseHandler = () => {
        this.setState({purchasing: true})
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false})
    }
    purchaseContinueHandler = () => {
        this.setState({loading: true})
        const order = { 
            ingredients: this.state.ingredients ,
            price: this.state.totalPrice ,
            costumer: {
                name: 'jone jones',
                address: {
                    street: 'streetTest 1' ,
                    zipCode: '41351',
                    country: 'Israel'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'fastest'
        }

        axios.post('/orders.json' , order)
        .then(response => {
            this.setState({loading: false , purchasing: false});
            console.log(response)
            }
        )
        .catch(error => {
            this.setState({loading: false , purchasing: false});
            console.log(error)
            }
        )

    }


    render() {

        const disabledInfo = {
            ...this.state.ingredients
        } 
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary =   <OrderSummary 
        ingredients={this.state.ingredients}
        purchaseCancelled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler}
        price={this.state.totalPrice}
        />
        if (this.state.loading) {
            orderSummary = <Spinner/>
        }
        return (
            <Auxillary>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                  {orderSummary}
                </Modal >
                <Burger ingredients={this.state.ingredients} />
                <BuildControls
                    ingredientAdded = {this.addIngredientHandler}
                    ingredientRemoved = {this.removeIngredientHandler}
                    disabled={disabledInfo}
                    purchaseable={this.state.purchaseable}
                    orderd={this.purchaseHandler}
                    price={this.state.totalPrice}
                    />
            </Auxillary>
        );
    }
}

export default withErrorHandler(BurgerBuilder , axios );