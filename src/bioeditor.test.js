import React from "react";
import { BioEditor } from "./bioeditor";
import { shallow } from "enzyme";
import axios from "./axios";

// Test 1
// this works i guess
test.only("When no bio is passed to BioEditor, an 'Add' button is rendered.", () => {
    const wrapper = shallow(<BioEditor />);
    expect(wrapper.find(".bio-editor-edit-mode-on").length).toBe(0);
});

// Test 2
test("When a bio is passed to it, an 'Edit' button is rendered.", () => {
    const wrapper = shallow(<BioEditor bio="bio is here!!!" />);
    expect(wrapper.find(".bio-editor-edit-mode-on").length.toBe(1));
});

// Test 3
test('Clicking either the "Add" or "Edit" button causes a textarea and a "Save" button to be rendered', () => {
    const wrapper = shallow(<BioEditor bio="bio is here" setBio="???" />);
});

// Test 4
test('licking the "Save" button causes an ajax request. The request should not actually happen during your test. To prevent it from actually happening, you should mock axios.', () => {
    const wrapper = shallow(<BioEditor bio="bio is here" setBio="???" />);
});

// Test 5
test("When the mock request is successful, the function that was passed as a prop to the component gets called.", () => {
    const wrapper = shallow(<BioEditor bio="bio is here" setBio="???" />);
});
