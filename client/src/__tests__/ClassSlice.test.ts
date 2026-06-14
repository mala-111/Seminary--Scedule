// src/__tests__/slices/ClassSlice.test.ts
import { configureStore } from "@reduxjs/toolkit";
import classReducer, { fetchClasses, createClass, deleteClass } from "../redux/slices/ClassSlice";
import { resetClasses } from "./setupMocks"; // <-- כאן

describe("ClassSlice Thunks", () => {
  let store: any;

  beforeEach(() => {
    resetClasses(); // <-- מאפס את המחלקות לפני כל טסט
    store = configureStore({ reducer: { class: classReducer } });
  });

  it("fetchClasses should load classes", async () => {
    await store.dispatch(fetchClasses());
    const state = store.getState().class;
    expect(state.classes).toHaveLength(1);
    expect(state.classes[0].name).toBe("Class A");
  });

it("createClass should add class", async () => {
  const store = configureStore({ reducer: { class: classReducer } });

  await store.dispatch(createClass({ name: "Class B" } as any));

  const state = store.getState().class;

  expect(state.classes).toHaveLength(1);
  expect(state.classes[0].name).toBe("Class B");
});

  it("deleteClass should remove class", async () => {
    await store.dispatch(deleteClass("1"));
    const state = store.getState().class;
    expect(state.classes.find((c: any) => c.classID === "1")).toBeUndefined();
  });
});