import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { addBug, getUnresolvedBugs, resolveBug } from '../bugs';
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

// integration test
describe("bugSlice", () => {
    // moving these outside of a specfic test since they'll need to be used by most of the tests anyway
    let fakeAxios;
    let store;

    // function that runs before each test 
    beforeEach(() => {
        fakeAxios = new MockAdapter(axios);
        store = createStore();
    });

    //helper functions
    const bugsSlice = () => store.getState().entities.bugs;
    const createState = () => ({
        entities: {
            bugs: {
                list: []
            }
        }
    });

    it("should add the bug to the store if it's saved to the server", async () => {
        // Arrange
        const bug = { description: 'a bug' }
        const savedBug = { ...bug, id: 1 }
        fakeAxios.onPost('/bugs').reply(200, savedBug);

        // Act
        await store.dispatch(addBug(bug));

        // Assert
        expect(bugsSlice().list).toContainEqual(savedBug);
    });

    it("should add the bug to the store if it's NOT saved to the server", async () => {
        // Arrange
        const bug = { description: 'a bug' }
        const savedBug = { ...bug, id: 1 }
        //mock an internal server error
        fakeAxios.onPost('/bugs').reply(500, savedBug);

        // Act
        await store.dispatch(addBug(bug));

        // Assert
        expect(bugsSlice().list).toHaveLength(0);
    });

    it("should resolve a bug if saved to the server", async () => {
        //Arrange
        const bug = { description: 'a bug' }
        const savedBug = { ...bug, id: 1, resolved: true }
        fakeAxios.onPost('/bugs').reply(200, savedBug);
        fakeAxios.onPatch("/bugs/1").reply(200, { id: 1, description: "a", resolved: true });
        //Act
        await store.dispatch(addBug(bug));
        await store.dispatch(resolveBug(1));
        //Assert
        expect(bugsSlice().list[0].resolved).toBe(true);
    });

    it("should NOT resolve a bug if NOT saved to the server", async () => {
        //Arrange
        fakeAxios.onPost('/bugs').reply(200, {id: 1});
        fakeAxios.onPatch("/bugs/1").reply(500);
        //Act
        await store.dispatch(addBug({}));
        await store.dispatch(resolveBug(1));
        //Assert
        expect(bugsSlice().list[0].resolved).not.toBe(true);
    });

    it("should load bugs", async () => {
        //
    });

    describe("selectors", () => {
        it("getUnresolvedBugs", () => {
            //getUnresolvedBugs selector in the bugs.js file
            const state = createState();
            state.entities.bugs.list = [
                { id: 1, resolved: true },
                { id: 2 },
                { id: 3 },
            ];
            //Act
            const result = getUnresolvedBugs(state);
            //Assert
            expect(result).toHaveLength(2);
        })
    });
   
});