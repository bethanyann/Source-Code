import { isEven }from './math';

//define a group or suite of tests 
describe("isEven function testing", () => {
    //define name of test and then define function that runs as the test 
    it("Return true if given an even number", () => {
        //function under test
        const result = isEven(2);

        //make an assertion as to what you expect to happen
        expect(result).toEqual(true);
    });

    it("Return false if given an odd number", () => {
        //function under test
        const result = isEven(1);

        //make an assertion as to what you expect to happen
        expect(result).toEqual(false);
    });
});

