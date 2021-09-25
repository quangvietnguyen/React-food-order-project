import { useRef, useState } from 'react';
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';
import styles from './Checkout.module.css';

const isEmpty = (value) => value.trim() === '';
const isSixChars = (value) => value.trim().length === 6;
//const stripePromise = loadStripe('pk_test_51JdSEwK8QP9eaYgIrRAGcwaOZFM8c4sD6ChxsTFkjIV1WUdBThge04Nin20mJf8xuCsxngfN5GaxDd3rBJz54wiJ00S1opVFEz');

const Checkout = (props) => {
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
    const confirmHandler = (event) => {
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
        <div className={styles.actions}>
            <button type="button" onClick={props.onCancel}>Cancel</button>
            <button className={styles.submit}>Confirm</button>
        </div>
    </form>
    )
};

export default Checkout;