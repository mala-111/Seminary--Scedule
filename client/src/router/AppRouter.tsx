import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Form from "../pages/Form";
import FormAdmin from "../pages/FormAdmin";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<Form />} />
        <Route path="/form-admin" element={<FormAdmin />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;