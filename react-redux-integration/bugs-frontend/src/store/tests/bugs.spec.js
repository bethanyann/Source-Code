import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { addBug, getUnresolvedBugs, resolveBug, loadBugs } from '../bugs';
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

    //loading bugs
    // - if they exist in the cache, they should come from the cache
    // - if they don't exist in the cache, they should be fetched from the server
    //      -- loading indicator should show when loading from server
    //      -- should be true while fetching, false after bugs are fetched, false if server fails

    describe("loading bugs", () => {
        
        describe("if the bugs exist in the cache", () => {
            if("they should not be fetched from the server again", async () => {
                fakeAxios.onGet("/bugs").reply(200, [{ id: 1,}]); 

                await store.dispatch(loadBugs());
                await store.dispatch(loadBugs());

                //fakeAxios contains a history prop to check if there's been more than one fetch to the server
                expect(fakeAxios.history.get.length).toBe(1);
            });
        });

        describe("if the bugs don't exist in the cache", () => {
            it("bugs should be fetched from the server and put in the store", async () => {
                fakeAxios.onGet("/bugs").reply(200, [{ id: 1,}]); 

                await store.dispatch(loadBugs());

                expect(bugsSlice().list).toHaveLength();
            });

            describe("loading indicator", () => {
                it("should be true while fetching bugs", () => {
                    //get bugs and just send one bug object back
                    fakeAxios.onGet("/bugs").reply(() => {
                        //return a function from the fakeAxios mock to test things that are happening before the response finishes
                        expect(bugsSlice().loading).toBe(true);
                        return [200, [{id: 1}]];
                    });
                    //don't await because we don't need to wait for the load to finish 
                    store.dispatch(loadBugs());
                });

                it("should be false after the bugs are fetch", async () => {
                    //get bugs and just send one bug object back
                    fakeAxios.onPost('/bugs').reply(200, {id: 1});
                    //await this call because we need it to finish before testing if the loading spinner is false
                    await store.dispatch(loadBugs());

                    expect(bugsSlice().loading).toBe(false);
                });

                it("should be false if the server returns an error", async () => {
                    //get bugs and just send one bug object back
                    fakeAxios.onPost('/bugs').reply(500);
                    //await this call because we need it to finish before testing if the loading spinner is false
                    expect(bugsSlice().loading).toBe(false);
                });
            })
        });
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