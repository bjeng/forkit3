import { combineReducers } from 'redux';
import testReducer from './testReducer';
import UserReducer from './UserReducer';
import LocationReducer from './LocationReducer';
import YelpReducer from './YelpReducer';
import YelpMultiReducer from './YelpMultiReducer';
import ResultReducer from './ResultReducer';
import OpenTableReducer from './OpenTableReducer';
import menuReducer from './menuReducer';
import FormReducer from './FormReducer';
import FriendReducer from './FriendReducer';

const rootReducer = combineReducers({
    test: testReducer,
    user: UserReducer,
    area: LocationReducer,
    yelp: YelpReducer,
    yelpMulti: YelpMultiReducer,
    results: ResultReducer,
    openTable: OpenTableReducer,
    menu: menuReducer,
    form: FormReducer,
    friend: FriendReducer
});


export default rootReducer;
