import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { RootLayout } from "./Components/RootLayout";
import { Home } from "./Components/Home";
import { ExcelCourse } from "./Components/ExcelCourse/ExcelCourse";
import Signup from "./Components/SignUp";
import SignIn from "./Components/Signin";
import CourseForm from "./Components/Courseform";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="Signup" element={<Signup />} />
      <Route path="Signin" element={<SignIn />} />
      <Route path="CourseForm" element={<CourseForm />} />
      <Route path="ExcelCourse" element={<ExcelCourse />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
