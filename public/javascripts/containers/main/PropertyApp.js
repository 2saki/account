import { connect } from 'react-redux'
import Property from '../../components/main/Property'

const mapStateToProps = (state) => {
  return {
    property: state.property
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: dispatch
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Property);
