import { useTheme } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { colors } from "../util/colors";

export interface TrickCardProps {
  player: string;
  isWinning?: boolean;
}

export const TrickCardBox: React.FC<TrickCardProps> = ({
  player,
  children,
  isWinning = false,
}) => {
  const theme = useTheme();
  const outlineColor = isWinning ? theme.palette.primary.main : "transparent";

  return (
    <Container outlineColor={outlineColor}>
      {children}
      <Spacer />
      <PlayerBox>{player}</PlayerBox>
    </Container>
  );
};

const Container = styled.div<{ outlineColor: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  max-width: 150px;
  height: 95px;
  margin: 0 5px;
  padding: 8px 10px;
  background-color: ${colors.lightTransparentGrey};
  border: 2px solid ${({ outlineColor }) => outlineColor};
  border-radius: 7px;
`;

const Spacer = styled.div`
  margin: 3px 0;
  flex-grow: 1;
`;

const PlayerBox = styled.div`
  min-width: 70px;
  max-width: 100%;
  font-size: 14px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
