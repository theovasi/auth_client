import React from 'react';
import "../static/css/app.css";

class Success extends React.Component {

	logoutUser = () => {
		this.props.cookies.remove('token');
		window.location.replace('/login');
	}

	render() {
		return (
			<div className='container'>
				<div className='success'>
					<span>You are logged in!</span>
					<div id='buttonContainer'>
						<a href="/login" className="button" onClick={this.logoutUser}>
							Logout
						</a>
					</div>
				</div>
			</div>
		)
	}
}

export default Success;
