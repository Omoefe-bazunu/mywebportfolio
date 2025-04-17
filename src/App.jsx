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
import { SmartPhoneDesign } from "./Components/SmartphoneDesign/SmartPhoneCourse";
import { WebCourse } from "./Components/WebCourse/WebCourse";
import Payment from "./Components/Payment";
import { Subscribers } from "./Components/Subsribers";
import { AddProjectForm } from "./Components/AddProjects";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="Signup" element={<Signup />} />
      <Route path="Signin" element={<SignIn />} />
      <Route path="CourseForm" element={<CourseForm />} />
      <Route path="ExcelCourse" element={<ExcelCourse />} />
      <Route path="SmartPhoneDesign" element={<SmartPhoneDesign />} />
      <Route path="WebDevCourse" element={<WebCourse />} />
      <Route path="Payment" element={<Payment />} />
      <Route path="Subscribers" element={<Subscribers />} />
      <Route path="addprojects" element={<AddProjectForm />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
