import { useEffect , useState } from 'react';
import styles from './AvailableMeals.module.css';
import Card from '../UI/Card';
import MealItem from './MealItem/MealItem';

const AvailableMeals = () => {
    const [meals, setMeals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchMeals = async () => {
            const response = await fetch('https://food-order-app-3b13d-default-rtdb.firebaseio.com/meals.json');
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }
            const responseData = await response.json();
            const loadedMeals = [];
            for (const key in responseData) {
                loadedMeals.push({
                    id:key,
                    name: responseData[key].name,
                    description: responseData[key].description,
                    price: responseData[key].price,
                })
            }
            setMeals(loadedMeals);
            setIsLoading(false);
        }
        fetchMeals().catch((e) => {
            setIsLoading(false);
            setError(e.message);
        });    
    },[])

    if (isLoading) {
        return <section className={styles.MealsLoading}>
            <p>Loading...</p>
        </section>
    }

    if (error) {
        return <section className={styles.Error}>
            <p>{error}</p>
        </section>
    }
    const mealsList = meals.map(meal => (
        <MealItem
            id={meal.id}
            key={meal.id}
            name={meal.name}
            description={meal.description}
            price={meal.price}
        />
    ));

    return (
        <section className={styles.meals}>
            <Card>
                <ul>{mealsList}</ul>
            </Card>
        </section>
    )
};

export default AvailableMeals;
