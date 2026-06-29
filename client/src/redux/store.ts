import { configureStore } from "@reduxjs/toolkit";
import teacherReducer from "./slices/teacherSlice";
import subjectReducer from "./slices/SubjectSlice";
import allClassesReducer from "./slices/AllClassesSlice";
import classReducer from "./slices/ClassSlice";
import hoursBookedReducer from "./slices/HoursBookedSlice";
import scheduleReducer from "./slices/scheduleSlice";
import teacherToSubjectReducer from "./slices/TeacherToSubjectSlice";
import daughtersTeacherReducer from "./slices/daughtersTeacherSlice";
import employeeReducer from "./slices/EmployeeSlice";
import adminReducer from "./slices/AdminSlice"; // הנתיב לסלייס שלך

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
    daughtersTeacher: daughtersTeacherReducer,
    employees: employeeReducer,
    admins: adminReducer
    
    
    
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
