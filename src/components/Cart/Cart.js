import React, { useContext, useState } from 'react';
import styles from './Cart.module.css';
import Modal from '../UI/Modal';
import CartContext from '../../storage/cart-context';
import CartItem from './CartItem';
import Checkout from './Checkout';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51JdSEwK8QP9eaYgIrRAGcwaOZFM8c4sD6ChxsTFkjIV1WUdBThge04Nin20mJf8xuCsxngfN5GaxDd3rBJz54wiJ00S1opVFEz');

const Cart = (props) => {
    
    const [isCheckout, setIsCheckout] = useState();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [didSubmitted, setDidSubmitted] = useState(false);
    const cartCtx = useContext(CartContext);
    const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
    const hasItems = cartCtx.items.length > 0;

    const cartItemRemoveHandler = (id) => {
        cartCtx.removeItem(id);
    };

    const cartItemAddHandler = (item) => {
        cartCtx.addItem({ ...item, amount: 1 });
    }

    const orderHandler = () => {
        setIsCheckout(true);
    }

    const submitOrderHandler = async (useData) => {
        setIsSubmitting(true);
        await fetch('https://food-order-app-3b13d-default-rtdb.firebaseio.com/orders.json',{
            method: 'POST',
            body: JSON.stringify({
                uesr: useData,
                orderedItems: cartCtx.items
            })
        });
        setIsSubmitting(false);
        setDidSubmitted(true);
        cartCtx.clearCart();
    };

    const cartItems = (
        <ul className={styles['cart-items']}>
            {cartCtx.items.map((item) => (
                <CartItem
                    key={item.id}
                    name={item.name}
                    amount={item.amount}
                    price={item.price}
                    onRemove={cartItemRemoveHandler.bind(null, item.id)}
                    onAdd={cartItemAddHandler.bind(null, item)}
                    disabled={isCheckout ? true : false}
                />
            ))}
        </ul>
    )
    

    const modalAction = (
        <div className={styles.actions}>
            <button className={styles['button--alt']} onClick={props.onClose}>Close</button>
            {hasItems && <button className={styles.button} onClick={orderHandler}>Order</button>}
        </div>
    )

    const cartModalContent = <Elements stripe={stripePromise}>
        {cartItems}
            <div className={styles.total}>
                <span>Total Amount</span>
                <span>{totalAmount}</span>
            </div>
            {isCheckout && <Checkout onSubmit={submitOrderHandler} onCancel={props.onClose}/>}
            {!isCheckout && modalAction}
    </Elements>

    const isSubmittingModalContent = <p>Sending order data...</p>;

    const didSubmitModalContent = (
        <React.Fragment>
            <p>Order payment successful!</p>
            <div className={styles.actions}>
                <button className={styles.button} onClick={props.onClose}>Close</button>
            </div>
        </React.Fragment>
    )
    
    return (
        <Modal onClose={props.onClose}>
            {!isSubmitting && !didSubmitted && cartModalContent}
            {isSubmitting && isSubmittingModalContent}
            {!isSubmitting && didSubmitted && didSubmitModalContent}
        </Modal>
    );
};

export default Cart;
