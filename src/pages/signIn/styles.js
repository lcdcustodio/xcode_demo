import styled from 'styled-components'; 'react-native'

const Container = styled.View`
  flex: 1;
  alignItems: center;
  justifyContent: center;
`;

const Logo = styled.Image`
  height: 40%;
  marginBottom: 40px;
`;

const Input = styled.TextInput`
  width: 300px;
  height: 52px;
  borderRadius: 5px;
  backgroundColor: "rgba(255, 255, 255, 0.3)";
  fontSize: 16px;
  fontWeight: bold;
  borderColor: #ffffff;
  borderWidth: 1px;
  borderStyle: solid;
  marginTop: 15px;
  marginBottom: 15px;
  color: #ffffff;
  paddingLeft: 20px;
  }
`;

const ErrorMessage = styled.Text`
  textAlign: center;
  color: #fff;
  fontSize: 16px;
  marginBottom: 15px;
  marginHorizontal: 20px;
`;

const Button = styled.TouchableHighlight`
  width: 300px;
  height: 52px;
  borderRadius: 5px;
  backgroundColor: #ffffff;
`;

const ButtonText = styled.Text`
  fontWeight: bold;
  fontSize: 16px;
  fontFamily: "Roboto";
  textAlign: center;
  color: #005cd1;
  backgroundColor: #fff;
  padding:15px;
  height: 52px;
`;

const SignUpLink = styled.TouchableHighlight`
  padding: 10px;
  marginTop: 20px;
`;

const SignUpLinkText = styled.Text`
  color: #999;
  fontWeight: bold;
  fontSize: 16px;
  textAlign: center;
`;

export { Container, Logo, Input, ErrorMessage, Button, ButtonText, SignUpLink, SignUpLinkText };
