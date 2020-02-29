import React, { Component } from "react";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Container,
  Card,
  CardTitle,
  CardText,
  CardFooter
} from "reactstrap";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Swal from "sweetalert2";
import DateTimePicker from 'react-datetime-picker';

const fechaStyle = {
  fontSize: "10px"
};
const buttonStyle = {
  float: "center",
  fontSize: "10px"
};
const cardStyle = {
    margin: '5px'
}

export default class Tareas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tareas: [],
      id: 0,
      titulo: "",
      descripcion: "",
      fecha_tarea: new Date(),
      modal: false,
      modalUpdate: false
    };

    this.toggle = this.toggle.bind(this);
    this.toggleUpdate = this.toggleUpdate.bind(this);
    this.handleTitulo = this.handleTitulo.bind(this);
    this.handleDescripcion = this.handleDescripcion.bind(this);
    this.handleFecha_Tarea = this.handleFecha_Tarea.bind(this);
    this.nuevaTarea = this.nuevaTarea.bind(this);
    this.chargeInputs = this.chargeInputs.bind(this);
  }

  componentDidMount = () => {
    this.getTareas();
  };

  vaciarInputs() {
    this.setState({
      titulo: "",
      descripcion: "",
      fecha_tarea: ""
    });
  }

  nuevaTarea() {
    axios
      .post("http://localhost:8000/api/nuevaTarea", {
        titulo: this.state.titulo,
        descripcion: this.state.descripcion,
        // fecha_tarea: moment(this.state.fecha_tarea).format('YYYY-DD-MM hh:mm:ss')
        fecha_tarea: moment(this.state.fecha_tarea).format('YYYY-MM-DD H:mm')
      })
      .then(() => {
        Swal.fire("Tarea agregada!", "Perfecto!", "success");
        this.toggle();
        this.getTareas();
      });
  }

  getTareas = () => {
    axios.get(`http://localhost:8000/api/tareas`).then(res => {
      // console.log(res)
      let data = res.data;
      console.log(data);
      this.setState({
        tareas: data
      });
    });
  };

  modificarTareas = () => {
    let { id, titulo, descripcion, fecha_tarea } = this.state;

    axios
      .put(`http://localhost:8000/api/modificarTarea`, {
        id: id,
        titulo: titulo,
        descripcion: descripcion,
        fecha_tarea: moment(fecha_tarea).format('YYYY-MM-DD H:mm')
      })
      .then(res => {
        Swal.fire("Tarea Mofificada!", "Perfecto!", "success");
        this.getTareas();
        this.toggleUpdate();
      });
  };

  borrarTarea(tarea) {
    let id = tarea.id;
    Swal.fire({
      title: "¿Esta usted seguro?",
      text: "Eliminar tarea " + tarea.titulo,
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Si!",
      cancelButtonText: "No!"
    }).then(result => {
      if (result.value) {
        console.log(id);
        axios
          .delete("http://localhost:8000/api/borrarTarea", {
            data: {
              id: id
            }
          })
          .then(res => {
            Swal.fire("Tarea eliminada!", "Perfecto!", "success");
            console.log(res);
            this.getTareas();
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelado", "Acción cancelada", "error");
      }
    });
  }

  toggle() {
    this.vaciarInputs();
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  chargeInputs(tarea) {
    this.toggleUpdate();
    this.setState({
      id: tarea.id,
      titulo: tarea.titulo_tarea,
      descripcion: tarea.descripcion_tarea,
      fecha_tarea: tarea.fecha_tarea
    });
  }

  toggleUpdate() {
    this.setState(prevState => ({
      modalUpdate: !prevState.modalUpdate
    }));
  }

  handleTitulo = event => {
    this.setState({ titulo: event.target.value });
  };

  handleDescripcion = event => {
    this.setState({ descripcion: event.target.value });
  };

  handleFecha_Tarea = date => {
    this.setState({ fecha_tarea: date });
  };

  render() {
    let { tareas, titulo, descripcion, fecha_tarea } = this.state;
    return (
      <Container>
        <h1>Tareas</h1>

        <Button color="primary" onClick={this.toggle}>
          Nueva tarea
        </Button>
        <br></br>
        <br></br>

        <Row>
          {tareas.map((tarea, index) => (
            <Col xs="12" sm="3" key={index} >
              <Card key={index} style={cardStyle}>
                <CardTitle>
                  <h5>{tarea.titulo_tarea}</h5>
                </CardTitle>
                <CardText>
                  <span style={fechaStyle}>
                    Fecha tarea{" "}
                    {moment(tarea.fecha_tarea).format("DD-MM-YYYY H:mm:ss a")}
                  </span>{" "}<br></br>
                    <span>{tarea.descripcion_tarea}</span>
                  <i style={fechaStyle}><br></br>{" "}
                    Tarea creada el{" "}
                    {moment (tarea.fecha_creacion).format("DD-MM-YYYY H:mm")}
                    {/* {Date(tarea.fecha_creacion).toISOString} */}
                  </i>
                </CardText>
                <CardFooter>
                  <Button color="warning" style={buttonStyle} onClick={() => this.chargeInputs(tarea)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>{" "}
                  <Button color="danger" style={buttonStyle} onClick={() => this.borrarTarea(tarea)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </CardFooter>
              </Card>
            </Col>
          ))}
        </Row>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle}>Nueva tarea</ModalHeader>
          <ModalBody>
            <Form>
              <Row form>
                <Col md={12} className="row">
                  <Col md={12}>
                    <FormGroup id="formStyle">
                      <Label id="formularioLabel">Título de la tarea:</Label>
                      <Input
                        type="text"
                        value={titulo}
                        onChange={this.handleTitulo}
                        placeholder="Escriba el título..."
                      />
                    </FormGroup>
                  </Col>
                  <Col md={12}>
                    <FormGroup id="formStyle">
                      <Label id="formularioLabel">Descripción de la tarea:</Label>
                      <Input
                        type="descripcion"
                        onChange={this.handleDescripcion}
                        value={descripcion}
                        placeholder="Escriba la descripción..."
                      />
                    </FormGroup>
                  </Col>
                  <Col md={12}>
                    <FormGroup id="formStyle">
                      <Label id="formularioLabel">Fecha de la tarea:</Label><br></br>
                      <DateTimePicker
                      onChange={this.handleFecha_Tarea}
                      value={this.state.fecha_tarea}
                    />
                    </FormGroup>
                  </Col>
                </Col>
              </Row>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.nuevaTarea}>
              Agregar
            </Button>{" "}
            <Button color="secondary" onClick={this.toggle}>
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>
        <Modal
          isOpen={this.state.modalUpdate}
          toggle={this.toggleUpdate}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggleUpdate}>Modificar tarea</ModalHeader>
          <ModalBody>
            <Form>
              <Row form>
                <Col md={12} className="row">
                  <Col md={12}>
                    <FormGroup id="formStyle">
                      <Label id="formularioLabel">Título  de la tarea:</Label>
                      <Input
                        type="text"
                        value={titulo}
                        onChange={this.handleTitulo}
                        placeholder="Escriba el título"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={12}>
                    <FormGroup id="formStyle">
                      <Label id="formularioLabel">Descripción de la tarea:</Label>
                      <Input
                        type="text"
                        onChange={this.handleDescripcion}
                        value={descripcion}
                        placeholder="Escriba la descripción"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={12}>
                    <FormGroup id="formStyle">
                      <Label id="formularioLabel">Fecha de la tarea:</Label><br></br>
                      <DateTimePicker
                      onChange={this.handleFecha_Tarea}
                      value={fecha_tarea}></DateTimePicker>
                    </FormGroup>
                  </Col>
                </Col>
              </Row>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.modificarTareas}>
              Modificar
            </Button>{" "}
            <Button color="secondary" onClick={this.toggleUpdate}>
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    );
  }
}
