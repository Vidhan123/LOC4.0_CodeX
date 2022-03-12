import { makeStyles } from '@material-ui/core/styles';

export const useHomeStyles = makeStyles((theme) => ({
  root: {
    height: '100vh !important',
    backgroundColor: '#fff !important',
    padding: '0 0 0 1vw !important',
  },
  appbar: {
    background: 'none !important',
    marginBottom: '3vh !important',
  },
  appbarTitle: {
    margin: '1.5vw 0 0 1vw !important',
    // fontFamily: 'Nunito !important',
    color: '#3F3D56 !important',
    fontSize: '3rem !important',
    cursor: 'default !important',
  },
  img: {
    marginTop: '5vh !important',
    maxHeight: '65vh !important',
    marginLeft: '5vw',
    maxWidth: '100% !important',
  },
  imgWrapper: {
    marginTop: '5vw !important',
  },
  highlight: {
    color: '#3f51b5 !important',
  },
  button: {
    width: '80% !important',
    maxWidth: '225px !important',
    padding: '5px !important',
    fontWeight: 'bold !important',
    letterSpacing: '0.5px !important',
    color: '#3F3D56 !important',
    border: '#000 1px solid !important',
    background: 'transparent !important',
    zIndex: '1100 !important',
    textTransform: 'none !important',
    // marginLeft: '10vh !important',
  },
  position: {
    position: 'absolute !important',
    top: '0 !important',
    left: '0 !important',
    width: '100% !important',
    height: '100% !important',
  },
}));