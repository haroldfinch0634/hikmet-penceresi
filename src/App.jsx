import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
	return (
		<BrowserRouter basename="/hikmet-penceresi">
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/login' element={<Login />} />
				<Route element={<ProtectedRoute />}>
					<Route path='/admin' element={<Admin />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
