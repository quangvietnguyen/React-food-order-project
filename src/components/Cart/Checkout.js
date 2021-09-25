import { useRef, useState, useContext, useEffect } from 'react';
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import styles from './Checkout.module.css';
import CartContext from '../../storage/cart-context';

const isEmpty = (value) => value.trim() === '';
const isSixChars = (value) => value.trim().length === 6;

const Checkout = (props) => {
    //-----------------------------STRIPE-----------------------------//
    const stripe = useStripe();
    const elements = useElements();
    const [paymentRequest, setPaymentRequest] = useState(null);
    // useEffect(() => {
    //     if (stripe) {
    //         const pr = stripe.paymentRequest({
    //             country: 'CA',
    //             currency: 'cad',
    //             total: {
    //               label: 'Demo total',
    //               amount: Math.round(cartContext.totalAmount),
    //             },
    //             requestPayerName: true,
    //             requestPayerEmail: true,
    //             //card: cardElement,
    //           });
    //     }
    // },[stripe])
    //-----------------------------STRIPE-----------------------------//
    const cartContext = useContext(CartContext);
    const [formInputsValidity, setFormInputsValidity] = useState({
        name: true,
        street: true,
        city: true,
        postalCode: true
    });
    const nameInputRef = useRef();
    const streetInputRef = useRef();
    const postalInputRef = useRef();
    const cityInputRef = useRef();

    const confirmHandler = async (event) => {
        event.preventDefault();
        
        const enteredName = nameInputRef.current.value;
        const enteredStreet = streetInputRef.current.value;
        const enteredPostal = postalInputRef.current.value;
        const enteredCity = cityInputRef.current.value;

        const enterNameIsValid = !isEmpty(enteredName);
        const enterStreetIsValid = !isEmpty(enteredStreet);
        const enterCityIsValid = !isEmpty(enteredCity);
        const enterPostalIsValid = isSixChars(enteredPostal);

        setFormInputsValidity({
            name: enterNameIsValid,
            street: enterStreetIsValid,
            city: enterCityIsValid,
            postalCode: enterPostalIsValid
        })

        const formIsValid = enterNameIsValid && enterStreetIsValid && enterCityIsValid && enterPostalIsValid;

        if (!formIsValid) {
            return;
        }
        //-----------------------------STRIPE-----------------------------//
        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
          }
      
          // Get a reference to a mounted CardElement. Elements knows how
          // to find your CardElement because there can only ever be one of
          // each type of element.
          const cardElement = elements.getElement(CardElement);
      
          // Use your card Element with other Stripe.js APIs
          const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
          });
            
      
          if (error) {
            console.log('[error]', error);
          } else {
            console.log('[PaymentMethod]', paymentMethod);
          }

        //-----------------------------STRIPE-----------------------------//
        props.onSubmit({
            name: enteredName,
            street: enteredStreet,
            city: enteredCity,
            postalCode: enteredPostal
        });
        
    };

    const nameControlStyle = `${styles.control} ${formInputsValidity.name ? '' : styles.invalid}`;
    const streetControlStyle = `${styles.control} ${formInputsValidity.street ? '' : styles.invalid}`;
    const postalControlStyle = `${styles.control} ${formInputsValidity.postalCode ? '' : styles.invalid}`;
    const cityControlStyle = `${styles.control} ${formInputsValidity.city ? '' : styles.invalid}`;


    return (
    <form className={styles.form} onSubmit={confirmHandler}>
        <div className={nameControlStyle}>
            <label htmlFor='name'>Your Name</label>
            <input type='text' id='name' ref={nameInputRef}/>
            {!formInputsValidity.name && <p>Please enter a valid name!</p>}
        </div>
        <div className={streetControlStyle}>
            <label htmlFor='street'>Street</label>
            <input type='text' id='street' ref={streetInputRef}/>
            {!formInputsValidity.street && <p>Please enter a valid street!</p>}
        </div>
        <div className={postalControlStyle}>
            <label htmlFor='postal'>Postal Code</label>
            <input type='text' id='postal' ref={postalInputRef}/>
            {!formInputsValidity.postalCode && <p>Please enter a valid Postal Code!</p>}
        </div>
        <div className={cityControlStyle}>
            <label htmlFor='city'>City</label>
            <input type='text' id='city' ref={cityInputRef}/>
            {!formInputsValidity.city && <p>Please enter a valid city!</p>}
        </div>
        <div className={styles.control}>
            <label htmlFor='payment'>Payment Method</label>
            <div style={{border:'1px solid #ccc', padding:'3px', borderRadius:'4px'}}>
                <CardElement
                    id='payment'
                    options={{
                        style: {
                        base: {
                            fontSize: '20px',
                            color: '#424770',
                            '::placeholder': {
                            color: '#aab7c4',
                            },
                        },
                        invalid: {
                            color: '#9e2146',
                        },
                        },
                    }}
                />
            </div>
        </div>
        <p>Powerby Stripe.com</p>
        <div className={styles.actions}>
            <button type="button" onClick={props.onCancel}>Cancel</button>
            <button type="submit" disabled={!stripe} className={styles.submit}>Pay CAD {cartContext.totalAmount}</button>
        </div>
    </form>
    )
};

export default Checkout;