import React, { Fragment } from "react";
import { BrowserRouter as Router, Switch, Route, Routes, Navigate } from "react-router-dom";
import HomePage from './routes/HomePage';
import UsersListPage from './routes/UsersListPage';
import UserLandingPage from './routes/UserLandingPage';
import RegisterPage from './routes/RegisterPage';
import VerSedesPage from './routes/VerSedesPage';
import LandingCuidadorPage from './routes/LandingCuidadorPage';
import LandingAdminPage from './routes/LandingAdminPage';
import FechasHorariosPage from './routes/FechasHorariosPage';
import MisReservasPage from './routes/MisReservasPage';
import AccountPage from './routes/AccountPage';
import SuccessPage from './routes/SuccessPage';
import FailurePage from './routes/FailurePage';
import SedesAdminPage from './routes/SedesAdminPage';
import { AuthProvider, AuthContext } from './components/AuthContext';

import './App.css';

// components
import AddUser from './components/AddUser';
import ListUsers from './components/ListUsers';
import User from "./components/User";
import NewUsersListPage from "./routes/NewUsersListPage";

const App = () => {
  // return (
  //   <Fragment>
  //       <ListUsers />
  //   </Fragment>
  // );
  return <div>
	<AuthProvider>
		<Router>
			<Routes>
				<Route 
				path="/"
				element={
					<>
					{ <HomePage />}
					</>
				} 
				/>
				<Route 
				path="/register"
				element={
					<>
					{ <RegisterPage />}
					</>
				} 
				/>
				<Route 
				path="/users_old"
				element={
					<>
					{ <UsersListPage /> }
					</>
				} 
				/>
				<Route 
				path="/users"
				element={
					<>
					{ <NewUsersListPage /> }
					</>
				} 
				/>
				<Route 
				path="/landing"
				element={
					<>
					{ <UserLandingPage /> }
					</>
				} 
				/>
				<Route 
				path="/ver-sedes"
				element={
					<>
					{ <VerSedesPage /> }
					</>
				} 
				/>
				<Route 
				path="/mis-reservas"
				element={
					<>
					{ <MisReservasPage /> }
					</>
				} 
				/>
				<Route 
				path="/landing-cuidador"
				element={
					<>
					{ <LandingCuidadorPage /> }
					</>
				} 
				/>
				<Route 
				path="/landing-admin"
				element={
					<>
					{ <LandingAdminPage /> }
					</>
				} 
				/>
				<Route 
				path="/sedes-admin"
				element={
					<>
					{ <SedesAdminPage /> }
					</>
				} 
				/>
				<Route 
				path="/fechas-y-horarios"
				element={
					<>
					{ <FechasHorariosPage /> }
					</>
				} 
				/>
				<Route 
				path="/account"
				element={
					<>
					{ <AccountPage /> }
					</>
				} 
				/>
				<Route 
				path="/success"
				element={
					<>
					{ <SuccessPage /> }
					</>
				} 
				/>
				<Route 
				path="/failure"
				element={
					<>
					{ <FailurePage /> }
					</>
				} 
				/>
			</Routes>
		</Router>
	</AuthProvider>
  </div>
}

export default App;
