import { combineReducers } from 'redux';
import Charger from './Charger';
import OnBoarding from './OnBoarding';
import User from './User';

const reducer = combineReducers({
    user: User,
    boarding: OnBoarding,
    charger: Charger,
});

export default reducer;