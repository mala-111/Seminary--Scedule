import { configureStore } from "@reduxjs/toolkit";
import teacherReducer from "./slices/TeacherSlice";
import subjectReducer from "./slices/SubjectSlice";
import allClassesReducer from "./slices/AllClassesSlice";
import classReducer from "./slices/ClassSlice";
import hoursBookedReducer from "./slices/HoursBookedSlice";
import scheduleReducer from "./slices/ScheduleSlice";
import teacherToSubjectReducer from "./slices/TeacherToSubjectSlice";
export const store = configureStore({
  reducer: {
    teachers: teacherReducer,
    subject: subjectReducer,
    classes: classReducer,
    allClasses: allClassesReducer,
    hoursBooked: hoursBookedReducer,
    teacherToSubject:
    teacherToSubjectReducer,
    schedule: scheduleReducer,
    
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;