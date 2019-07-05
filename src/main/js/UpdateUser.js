import React from "react"
import {Link, withRouter} from 'react-router-dom'
import client from "./client"
import {Button, Container, Form, FormGroup, Input, Label} from "reactstrap";


class UpdateUser extends React.Component {

  constructor(props) {
    super(props)
    this.state = {"user": null}
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.onUpdate = this.onUpdate.bind(this)
  }

  componentDidMount() {
    client.get(`/users/${this.props.match.params.id}`)
      .then(response=> {
        this.setState({"user": response.data})
      })
      .catch(error=> {
        console.error("Unknown error getting user", this.props.match.params.id, "-", error)
        alert('An Error ocurred')
        this.props.history.push('/')
      })
  }

  handleChange(event) {
    const target = event.target
    const value = target.value
    const name = target.name
    let user = {...this.state.user}
    user[name] = value
    this.setState({user: user})
  }

  onUpdate() {
    return client({
      method: 'put',
      url: this.state.user._links.self.href,
      data: this.state.user,
      headers: {
        'Content-Type': 'application/json'
        //,'If-Match': user.headers.Etag
      }
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    this.onUpdate()
      .then(response => {
        window.location = "/"
      }).catch(error => {
        if (error.response.status == 403) {
          alert('ACCESS DENIED: You are not authorized to update ' +
            this.state.user._links.self.href);
        } else if (error.response.status == 412) {
          alert('DENIED: Unable to update ' + this.state.user._links.self.href +
            '. Your copy is stale.');
        } else {
          //TODO Improve error handling!
          console.error("Unknown error updating user -", error)
          alert('An Error ocurred')
        }
      })
  }

  render() {
    return (
      <Container>
        <h3>Update User</h3>
        {this.state.user &&
          <Form>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input type="text" placeholder="Email" name="email" defaultValue={this.state.user.email}
                     onChange={this.handleChange}/>
            </FormGroup>
            <FormGroup>
              <Label for="firstName">First name</Label>
              <Input type="text" placeholder="First Name" name="firstName" defaultValue={this.state.user.firstName}
                     onChange={this.handleChange}/>
            </FormGroup>
            <FormGroup>
              <Label for="lastName">Last name</Label>
              <Input type="text" placeholder="Last Name" name="lastName" defaultValue={this.state.user.lastName}
                     onChange={this.handleChange}/>
            </FormGroup>
            <FormGroup>
              <Label for="description">Notes</Label>
              <Input type="text" placeholder="Notes" name="description" defaultValue={this.state.user.description}
                     onChange={this.handleChange}/>
            </FormGroup>
            <FormGroup>
              <Button color="primary" onClick={this.handleSubmit}>Save</Button>{' '}
              <Button color="secondary" tag={Link} to="/">Cancel</Button>
            </FormGroup>
          </Form>
        }
      </Container>
    )
  }
}

export default withRouter(UpdateUser)
