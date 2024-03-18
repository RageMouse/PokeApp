import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function HomeCard() {
  const [name, setName] = useState('');
  const [teamName, setTeamName] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    setName(event.target.value);
  };

  const handleTeamNameChange = (event) => {
    setTeamName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    Cookies.set('username', name);
    Cookies.set('teamName', teamName);
    navigate('/pokemon');
  };

  return (
      <Card style={{ width: '18rem' }}>
        <Card.Body>
          <Card.Title>Welkom bij mijn Poké-App!</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Vul uw naam in:</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={handleChange}
                placeholder="Jouw naam"
                required
                style={{marginBottom: '10px'}}
              />
              <Form.Label>Vul uw team naam in:</Form.Label>
              <Form.Control
                type="text"
                value={teamName}
                onChange={handleTeamNameChange}
                placeholder="Team naam"
                required
                style={{marginBottom: '10px'}}
              />
            </Form.Group>
            <Button variant="primary" type="submit" >
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
  );
}

export default HomeCard;