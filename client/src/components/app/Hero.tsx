// create hero component
import React from "react";
import { Button, Container, Link, Typography } from "@mui/joy";
import ArrowForward from "@mui/icons-material/ArrowForward";
import TwoSidedLayout from "./TwoSidedLayout";
import { NextLinkComposed } from "../link/Link";

const Hero = () => {
    return (
        <Container fixed>
            <TwoSidedLayout>
                <Typography color="primary" fontSize="lg" fontWeight="lg">
                    Elevate Your Eco-Conscious Lifestyle
                </Typography>
                <Typography
                    level="h1"
                    fontWeight="xl"
                    fontSize="clamp(1.875rem, 1.3636rem + 2.1818vw, 3rem)"
                >
                    Discover a World of Sustainable Living
                </Typography>
                <Typography fontSize="lg" textColor="text.secondary" lineHeight="lg">
                    Delve into the charm of conscious consumption with Sustainabox. Each box is a pledge to the planet, brimming with eco-friendly essentials that don&apos;t compromise on quality or design. Embrace a life where every product tells a story of sustainability and every purchase amplifies your impact on the environment.
                </Typography>
                <Button
                    component={NextLinkComposed}
                    to={{
                        pathname: '/signup',
                    }}
                    size="lg" endDecorator={<ArrowForward fontSize="large" />}>
                    Get Started
                </Button>
                <Typography>
                    Already a member? {' '}
                    <Link
                        component={NextLinkComposed}
                        to={{
                            pathname: '/login',
                        }}
                        level="title-md"
                    >Sign in</Link>
                </Typography>
            </TwoSidedLayout>
        </Container>
    );
};

export default Hero;