import {useDispatch} from "react-redux";
import React, {useState} from "react";
import {postLogin} from "../../Redux/actions";
import { A, navigate} from 'hookrouter';
import {makeStyles} from "@material-ui/styles";
import { Box, Button, Card, CardActions, CardContent, CardHeader, Grid} from '@material-ui/core';
import {TextInputField} from '../Common/HelperInputFields';
import { get } from 'lodash';
import {PublicDashboard} from "../Dashboard/PublicDashboard";

const useStyles = makeStyles(theme => ({
    formTop: {
        marginTop: '100px',
    },
    pdLogo: {
        height: '345px',
        border: 'solid 3px white'
    },
    logoImg:{
        objectFit:'contain',
        height:'8rem',
    },
    imgSection:{
        paddingBottom:'45px',
    }
}));


export const Login = () => {
    const classes = useStyles();
    const dispatch: any = useDispatch();
    const initForm: any = {
        username: '',
        password: '',
    };
    const initErr: any = {};
    const [form, setForm] = useState(initForm);
    const [errors, setErrors] = useState(initErr);

    const handleChange = (e: any) => {
        const {value, name} = e.target;
        const fieldValue = Object.assign({}, form);
        const errorField = Object.assign({}, errors);
        if (errorField[name]) {
            errorField[name] = null;
            setErrors(errorField);
        }
        fieldValue[name] = value;
        if (name === 'username') {
            fieldValue[name] = value.toLowerCase();
        }
        setForm(fieldValue);
    };
    const validateData = () => {
        let hasError = false;
        const err = Object.assign({}, errors);
        Object.keys(form).forEach((key) => {
            if (typeof (form[key]) === 'string' && key !== 'password' && key !== 'confirm') {
                if (!form[key].match(/\w/)) {
                    hasError = true;
                    err[key] = 'This field is required';
                }
            }
            if (!form[key]) {
                hasError = true;
                err[key] = 'This field is required';
            }
        });
        if (hasError) {
            setErrors(err);
            return false;
        }
        return form;
    };
    const handleSubmit = (e: any) => {
        e.preventDefault();
        const valid = validateData();
        if (valid) {
            dispatch(postLogin(valid)).then((resp: any) => {
                const res = get(resp, 'data', null);
                const statusCode = get(resp, 'status', '');
                if (res && statusCode === 401) {
                    const err = {
                        password: 'Username or Password incorrect',
                    };
                    setErrors(err);
                } else if (res && statusCode === 200) {
                    localStorage.setItem('care_access_token', res.access);
                    navigate('/privatedashboard');
                    window.location.reload();
                }
            });
        }
    };

    return (
        <Box display="flex" flexDirection="column" className={`${classes.formTop}`}>
            <Box className={classes.imgSection} display="flex" flexDirection="column" justifyContent="flex-start">
            <Grid container spacing={2}>
                <Grid item className="w3-hide-small" xs={12} sm={7} md={8} lg={9}>
                    <Grid item>
                        <PublicDashboard/>
                    </Grid>

                </Grid>
                <Grid item xs={12} sm={5} md={4} lg={3}>
                    <Card>
                        <CardHeader title="Authorized Login"/>
                        <form onSubmit={(e) => handleSubmit(e)}>
                            <CardContent>
                                <TextInputField
                                    name="username"
                                    placeholder="User Name"
                                    variant="outlined"
                                    margin="dense"
                                    InputLabelProps={{ shrink: !!form.username }}
                                    value={form.username}
                                    onChange={handleChange}
                                    errors={errors.username}
                                />
                                <TextInputField
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    variant="outlined"
                                    margin="dense"
                                    InputLabelProps={{ shrink: !!form.password }}
                                    value={form.password}
                                    onChange={handleChange}
                                    errors={errors.password}
                                />
                            </CardContent>

                            <CardActions className="padding16">
                                {/*<A href="/forgot-password">Forgot password ?</A>*/}
                                <Button
                                    color="primary"
                                    variant="contained"
                                    type="submit"
                                    style={{marginLeft: 'auto'}}
                                    onClick={(e) => handleSubmit(e)}
                                >Login
                                </Button>
                            </CardActions>
                        </form>
                        {/*<CardContent className="alignCenter">*/}
                        {/*    You don't have an account? <A href="/register">Register</A>*/}
                        {/*</CardContent>*/}
                        <CardContent className="alignCenter">
                            Onboard Ambulances <A href="/ambulance">here</A>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            </Box>
            <Box className={classes.imgSection} display="flex" flexDirection="column" justifyContent="center" alignContent="center">
                <img src="https://care-coronasafe.s3.amazonaws.com/static/images/logos/ksdma_logo.png" alt="Care Logo" className={classes.logoImg}/>
            </Box>
        </Box>


    );
};
