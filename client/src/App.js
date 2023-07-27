import React, { Fragment } from "react";
import { BrowserRouter as Router, Switch, Route, Routes, Navigate } from "react-router-dom";
import HomePage from './routes/HomePage';
import UsersListPage from './routes/UsersListPage';
import UserLandingPage from './routes/UserLandingPage';
import RegisterPage from './routes/RegisterPage';
import LandingAdminPage from './routes/LandingAdminPage';
import AccountPage from './routes/AccountPage';
import CancionesAdminPage from './routes/CancionesAdminPage';
import ArtistasAdminPage from './routes/ArtistasAdminPage';
import GenerosAdminPage from './routes/GenerosAdminPage';
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
				path="/landing-admin"
				element={
					<>
					{ <LandingAdminPage /> }
					</>
				} 
				/>
				<Route 
				path="/canciones-admin"
				element={
					<>
					{ <CancionesAdminPage /> }
					</>
				} 
				/>
				<Route 
				path="/artistas-admin"
				element={
					<>
					{ <ArtistasAdminPage /> }
					</>
				} 
				/>
				<Route 
				path="/generos-admin"
				element={
					<>
					{ <GenerosAdminPage /> }
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
			</Routes>
		</Router>
	</AuthProvider>
  </div>
}

export default App;
