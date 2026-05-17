import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Form from "../pages/Form";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<Form />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;