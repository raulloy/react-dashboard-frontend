import * as React from 'react';
import { useState, useContext } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Modal, Button } from 'react-bootstrap';
import DateRangeInput from '../DatePickers/DateRangeInput';
import { AccountsDataStoreContext } from '../../data/AccountsDataStore';
import Cards from '../Cards/Cards';
import './Table.css';

export default function AccountsTable() {
  const { since, setSince, until, setUntil, accountInsights } = useContext(
    AccountsDataStoreContext
  );

  const [show, setShow] = useState(false);
  const [actions, setActions] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = (accountID) => {
    const account = accountInsights.find(
      (item) => item.account_id === accountID
    );
    setShow(true);
    setActions(account.actions);
  };

  if (accountInsights.length === 0) {
    return <div>Getting data...</div>;
  }

  return (
    <div>
      <Cards />

      <div className="Table">
        <h3>Account Insights</h3>

        <DateRangeInput
          since={since}
          setSince={setSince}
          until={until}
          setUntil={setUntil}
        />

        <TableContainer
          component={Paper}
          style={{
            width: '100%',
            boxShadow: '0px 13px 20px 0px #80808029',
            overflow: 'auto',
            backgroundColor: 'transparent',
          }}
          sx={{ maxHeight: 350 }}
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
                <TableCell align="left">CTR</TableCell>
                <TableCell align="left">Leads</TableCell>
                <TableCell align="left">CPL</TableCell>
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
                    $
                    {parseFloat(element.cpc).toFixed(2).toLocaleString('en-US')}
                  </TableCell>
                  <TableCell align="left">
                    $
                    {parseFloat(element.ctr).toFixed(2).toLocaleString('en-US')}
                  </TableCell>
                  <TableCell align="left">
                    {
                      (
                        element.actions.find(
                          (element) => element.action_type === 'lead'
                        ) || {}
                      ).value
                    }
                  </TableCell>
                  <TableCell align="left">
                    $
                    {(
                      parseFloat(element.spend) /
                      parseFloat(
                        (
                          element.actions.find(
                            (element) => element.action_type === 'lead'
                          ) || {}
                        ).value
                      )
                    )
                      .toFixed(2)
                      .toLocaleString('en-US')}
                  </TableCell>
                  <TableCell align="center" className="Details">
                    <Button
                      onClick={() => handleShow(element.account_id)}
                      style={{
                        backgroundColor: '#52b1ff',
                        borderColor: 'transparent',
                      }}
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
            <div style={{ overflowX: 'auto' }}>
              <Table>
                <thead>
                  <tr style={{ textAlign: 'center' }}>
                    <th>Tipos de interacción</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {actions.length ? (
                    actions.map((action, index) => (
                      <tr key={index} style={{ textAlign: 'center' }}>
                        <td>{action.action_type}</td>
                        <td>
                          {parseInt(action.value).toLocaleString('en-US')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2">No actions found.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
