import { addBug } from '../bugs';
import { apiCallBegan } from '../api';
import createStore from '../configureStore';

describe("bugSlice Tests", () => {
    describe("action creators", () => {
        it("addBug", () => {
            //bug test obj 
            const bug = { description: 'a test bug'}
            //call action creator here
            const result = addBug(bug);
            //export const apiCallBegan = createAction("apiCallBegan")
            const expected = {
                type: apiCallBegan.type,
                //payload can be found in bugs.js under the addBug function
                payload: {
                    url: '/bugs',
                    method: 'post',
                    data: bug,
                    onSuccess: 'bugs/bugAdded'
                }
            }

            expect(result).toEqual(expected);
        })
    });
});

//integration test
describe("bugSlice", () => {
    it("should handle the addBug action", async () => {
        // dispatch(addbug) => store
        const store = createStore();
        const bug = { description: 'a bug'}

        await store.dispatch(addBug(bug));
        expect(store.getState().entities.bugs.list).toHaveLength(1);

        //console.log(store.getState());
    });
})