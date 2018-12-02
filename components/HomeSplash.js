import {Jumbotron, Button} from 'reactstrap';
export default (props) => {
    return (
      <div>
        <Jumbotron>
          <h1 className="display-3">Cultlang</h1>
          <p className="lead">A Programming Metalanguage.</p>
          <hr className="my-2" />
          {/* <p>This page is under construction.</p> */}
          <p className="lead">
            <a href="https://github.com/cultlang/cultlang"><Button color="primary">See The Source</Button></a>
          </p>
        </Jumbotron>
      </div>
    );
  };