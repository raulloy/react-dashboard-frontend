import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './Table.css';
import { Modal, Button } from 'react-bootstrap';
import { accountsData } from '../../data/facebook';

export default function AccountsTable() {
  const [since, setSince] = useState('2023-03-01');
  const [until, setUntil] = useState('2023-03-31');

  const [accountInsights, setAccountInsights] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Account Insights
        const accountsResponse = await accountsData(since, until);
        setAccountInsights(accountsResponse.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [since, until]);

  const [show, setShow] = useState(false);
  const [actions, setActions] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = (accountId) => {
    const account = accountInsights.find(
      (item) => item.account_id === accountId
    );
    setShow(true);
    setActions(account.actions);
  };

  return (
    <div className="Table">
      <h3>Account Insights</h3>

      <Form>
        <Row>
          <Col sm={4} md={3} className="my-2">
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text>Desde</InputGroup.Text>
              <Form.Control
                type="date"
                value={since}
                onChange={(e) => setSince(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col sm={4} md={3} className="my-2">
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text>Hasta</InputGroup.Text>
              <Form.Control
                type="date"
                value={until}
                onChange={(e) => setUntil(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>
      </Form>

      <TableContainer
        component={Paper}
        style={{
          boxShadow: '0px 13px 20px 0px #80808029',
          overflow: 'auto',
        }}
        sx={{ maxHeight: 400 }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Desarrollo</TableCell>
              <TableCell align="left">Alcance</TableCell>
              <TableCell align="left">Impresiones</TableCell>
              <TableCell align="left">Clics</TableCell>
              <TableCell align="left">Gastado</TableCell>
              <TableCell align="left">CPC</TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{ color: 'white' }}>
            {accountInsights.map((element) => (
              <TableRow
                key={element.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {element.account_name}
                </TableCell>
                <TableCell align="left">
                  {parseInt(element.reach).toLocaleString('en-US')}
                </TableCell>
                <TableCell align="left">
                  {parseInt(element.impressions).toLocaleString('en-US')}
                </TableCell>
                <TableCell align="left">
                  {parseInt(element.clicks).toLocaleString('en-US')}
                </TableCell>
                <TableCell align="left">
                  ${parseFloat(element.spend).toLocaleString('en-US')}
                </TableCell>
                <TableCell align="left">
                  ${parseFloat(element.cpc).toFixed(2).toLocaleString('en-US')}
                </TableCell>
                <TableCell align="center" className="Details">
                  <Button
                    variant="primary"
                    onClick={() => handleShow(element.account_id)}
                  >
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Interacciones</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Tipos de interacción</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {actions.length ? (
                actions.map((action, index) => (
                  <tr key={index}>
                    <td>{action.action_type}</td>
                    <td>{parseInt(action.value).toLocaleString('en-US')}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">No actions found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
