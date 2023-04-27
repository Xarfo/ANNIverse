import type { NextApiRequest, NextApiResponse } from "next";

import prisma, { Role } from "@/prisma";

export const userRoles: Role[] = ["Admin", "PM", "SoftwareDev", "Volunteer"];

export const userCanOperate = (
  checkedRole: Role,
  incomingRole: Role
): boolean => userRoles.indexOf(incomingRole) >= userRoles.indexOf(checkedRole);

export default (role: Role) => async (req: any, res: any, next: any) => {
  if (req.jwt) {
    const user = await prisma.user.findUnique({
      where: { id: req.jwt.userId },
      select: { role: true },
    });
    if (user?.role) {
      if (userCanOperate(role, user.role)) {
        req.role = user.role;
        next();
      }
    }
    res.sendStatus(403);
  }
  res.sendStatus(401);
};
