import React from "react";
import firebase from "../../firebase";
import md5 from "md5"; // used to hash messages
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon
} from "semantic-ui-react";
import {Link} from "react-router-dom";

class Register extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors: [],
    loading: false,
    usersRef: firebase.database().ref("users")
  };

  isFormValid = () => {
    let errors = [];
    let error;

    if (this.isFormEmpty(this.state)) {
      // throw error
      error = {message: "Fill in all fields"};
      this.setState({errors: errors.concat(error)});
      return false;
    } else if (!this.isPasswordValid(this.state)) {
      // throw error
      error = {message: "Password is invalid"};
      this.setState({errors: errors.concat(error)});
      return false;
    } else {
      // form valid
      return true;
    }
  };

  isFormEmpty = ({username, email, password, passwordConfirmation}) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
      // if any of these lengths are 0 -> returns true
    );
  };

  isPasswordValid = ({password, passwordConfirmation}) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  };

  displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  handleChange = e => this.setState({[e.target.name]: e.target.value});

  handleSubmit = e => {
    e.preventDefault();
    if (this.isFormValid()) {
      this.setState({errors: [], loading: true});
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password) // a Promise
        .then(createdUser => {
          console.log(createdUser);
          createdUser.user
            .updateProfile({
              displayName: this.state.username,
              photoURL: `http://gravatar.com/avatar/${md5(
                createdUser.user.email // unique value created by firebase
              )}?d=identicon`
            })
            .then(() => {
              // this.setState({loading: false});
              this.saveUser(createdUser).then(() => {
                console.log("user saved");
              });
              this.setState({loading: false});
            })
            .catch(err => {
              console.error(err);
              this.setState({
                errors: this.state.errors.concat(err),
                loading: false
              });
            });
        })
        .catch(err => {
          console.log(err);
          this.setState({
            errors: this.state.errors.concat(err),
            loading: false
          });
        });
      // Error: "The given sign-in provider is disabled"
      // Firebase dashboard -> Authentication -> Email/Password -> Enable
    }
  };

  saveUser = createdUser => {
    // firebase -> Database -> Real-time DB -> Create DB -> Start in Test Mode -> Enable
    return (
      this.state.usersRef
        .child(createdUser.user.uid) // .child() - firebase method
        // uid in the createdUser object
        .set({
          name: createdUser.user.displayName,
          avatar: createdUser.user.photoURL
        })
    );
  };

  handleInputError = (errors, inputName) => {
    // Makes input error dynamic
    // counterpart of handle change
    return errors.some(
      error =>
        error.message.toLowerCase().includes(inputName) ||
        error.message.toLowerCase().includes("all")
    )
      ? "error"
      : "";
  };

  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
      errors,
      loading
    } = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{maxWidth: 450}}>
          <Header as="h2" icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange">
              Register for DevChat
            </Icon>
          </Header>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                onChange={this.handleChange}
                value={username}
                className={this.handleInputError(errors, "username")}
                // The some() method tests whether at least one element in the array
                // passes the test implemented by the provided function.
                // If at least 1 item in the arr meets the condition - it's true,
                // if no items in the arr meets the condition - it's false
                type="text"
              />
              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                onChange={this.handleChange}
                value={email}
                className={this.handleInputError(errors, "email")}
                type="text"
              />
              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                onChange={this.handleChange}
                value={password}
                className={this.handleInputError(errors, "password")}
                type="password"
              />
              <Form.Input
                fluid
                name="passwordConfirmation"
                icon="repeat"
                iconPosition="left"
                placeholder="Password Confirmation"
                onChange={this.handleChange}
                value={passwordConfirmation}
                className={this.handleInputError(errors, "password")}
                type="password"
              />

              {/* Loading button */}
              <Button
                disabled={loading} // bec loading evaluates to TRUE : FALSE
                className={loading ? "loading" : ""}
                color="orange"
                fluid
                size="large"
              >
                Submit
              </Button>
            </Segment>
          </Form>
          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>
          )}
          <Message>
            Already a user?<Link to="/login">Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

/* 
Problem: 
- It's possible to hit Submit twice
- We're not clearing errors when registration is successful
*/

export default Register;
