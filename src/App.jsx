import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { RootLayout } from "./Components/RootLayout";
import { Home } from "./Components/Home";
import { ExcelCourse } from "./Components/ExcelCourse/ExcelCourse";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="ExcelCourse" element={<ExcelCourse />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
