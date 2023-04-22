import { Calendar } from './Calendar';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 720px;
  margin: auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  //border: 1px black solid;
`;

function App() {
  return (
    <Container>
      {/*<h2>Header</h2>*/}
      {/*<h2>Main</h2>*/}
      <Calendar />
      {/*<h2>Footer</h2>*/}
    </Container>
  );
}

export default App;
