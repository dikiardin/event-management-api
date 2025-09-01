# API Implementation Mapping (Routers → Controllers → Services)

Dokumen ini memetakan setiap endpoint pada dokumentasi ke implementasi kodenya (router, controller, service) agar mudah ditelusuri saat testing/debugging.

## Transaction Management API

- Base Path: `/api/transactions`

### GET /organizer → Get All Organizer Transactions

- Router: `src/routers/transaction.router.ts` → `getOrganizerTransactions`

```1:30:src/routers/transaction.router.ts
this.route.get(
  "/organizer",
  verifyToken,
  verifyRole([RoleType.ORGANIZER]),
  this.transactionController.getOrganizerTransactions
);
```

- Controller: `src/controllers/transaction.controller.ts` → `getOrganizerTransactions`

```124:137:src/controllers/transaction.controller.ts
public async getOrganizerTransactions(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = res.locals.decrypt?.id;
    if (!userId) throw new Error("Unauthorized");

    const transactions =
      await TransactionService.getOrganizerTransactionsService(userId);
    res.status(200).json({ success: true, transactions });
  } catch (error) {
    next(error);
  }
}
```

- Service: `src/service/transaction.service.ts` → `getOrganizerTransactionsService`

```218:222:src/service/transaction.service.ts
public static async getOrganizerTransactionsService(organizerId: number) {
  return TransactionRepository.getOrganizerTransactionsRepo(organizerId);
}
```

### GET /organizer/status/:status → Get Transactions by Status

- Router: `src/routers/transaction.router.ts` → `getOrganizerTransactionsByStatus`

```65:70:src/routers/transaction.router.ts
this.route.get(
  "/organizer/status/:status",
  verifyToken,
  verifyRole([RoleType.ORGANIZER]),
  this.transactionController.getOrganizerTransactionsByStatus
);
```

- Controller: `src/controllers/transaction.controller.ts` → `getOrganizerTransactionsByStatus`

```160:177:src/controllers/transaction.controller.ts
public async getOrganizerTransactionsByStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = res.locals.decrypt?.id;
    if (!userId) throw new Error("Unauthorized");

    const { status } = req.params;
    if (!status) throw new Error("Status parameter is required");

    const transactions =
      await TransactionService.getOrganizerTransactionsByStatusService(
        userId,
        status
      );
    res.status(200).json({ success: true, transactions });
  } catch (error) {
    next(error);
  }
}
```

- Service: `src/service/transaction.service.ts` → `getOrganizerTransactionsByStatusService`

```232:245:src/service/transaction.service.ts
public static async getOrganizerTransactionsByStatusService(
  organizerId: number,
  status: string
) {
  // Validate status
  const validStatuses = Object.values($Enums.PaymentStatusType);
  if (!validStatuses.includes(status as $Enums.PaymentStatusType)) {
    throw new Error("Invalid payment status");
  }

  return TransactionRepository.getOrganizerTransactionsByStatusRepo(
    organizerId,
    status as $Enums.PaymentStatusType
  );
}
```

### POST /organizer/accept/:id → Accept Transaction

- Router: `src/routers/transaction.router.ts` → `acceptTransaction`

```72:77:src/routers/transaction.router.ts
this.route.post(
  "/organizer/accept/:id",
  verifyToken,
  verifyRole([RoleType.ORGANIZER]),
  this.transactionController.acceptTransaction
);
```

- Controller: `src/controllers/transaction.controller.ts` → `acceptTransaction`

```183:202:src/controllers/transaction.controller.ts
public async acceptTransaction(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = res.locals.decrypt?.id;
    if (!userId) throw new Error("Unauthorized");

    const { id } = req.params;
    const transaction = await TransactionService.acceptTransactionService(
      Number(id),
      userId
    );

    res.status(200).json({
      success: true,
      message: "Transaction accepted successfully",
      transaction,
    });
  } catch (error) {
    next(error);
  }
}
```

- Service: `src/service/transaction.service.ts` → `acceptTransactionService`

```248:265:src/service/transaction.service.ts
public static async acceptTransactionService(
  transactionId: number,
  organizerId: number
) {
  try {
    const transaction = await TransactionRepository.acceptTransactionRepo(
      transactionId,
      organizerId
    );

    // Log the acceptance for audit purposes
    console.log(
      `Transaction ${transactionId} accepted by organizer ${organizerId}`
    );

    return transaction;
  } catch (error) {
    throw error;
  }
}
```

### POST /organizer/reject/:id → Reject Transaction

- Router: `src/routers/transaction.router.ts` → `rejectTransaction`

```79:84:src/routers/transaction.router.ts
this.route.post(
  "/organizer/reject/:id",
  verifyToken,
  verifyRole([RoleType.ORGANIZER]),
  this.transactionController.rejectTransaction
);
```

- Controller: `src/controllers/transaction.controller.ts` → `rejectTransaction`

```208:230:src/controllers/transaction.controller.ts
public async rejectTransaction(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = res.locals.decrypt?.id;
    if (!userId) throw new Error("Unauthorized");

    const { id } = req.params;
    const { rejection_reason } = req.body;

    const transaction = await TransactionService.rejectTransactionService(
      Number(id),
      userId,
      rejection_reason
    );

    res.status(200).json({
      success: true,
      message: "Transaction rejected successfully",
      transaction,
    });
  } catch (error) {
    next(error);
  }
}
```

- Service: `src/service/transaction.service.ts` → `rejectTransactionService`

```269:289:src/service/transaction.service.ts
public static async rejectTransactionService(
  transactionId: number,
  organizerId: number,
  rejectionReason?: string
) {
  try {
    const transaction = await TransactionRepository.rejectTransactionRepo(
      transactionId,
      organizerId,
      rejectionReason
    );

    // Log the rejection for audit purposes
    console.log(
      `Transaction ${transactionId} rejected by organizer ${organizerId}. Reason: ${
        rejectionReason || "No reason provided"
      }`
    );

    return transaction;
  } catch (error) {
    throw error;
  }
}
```

### GET /organizer/proof/:id → Get Payment Proof

- Router: `src/routers/transaction.router.ts` → `getTransactionPaymentProof`

```86:91:src/routers/transaction.router.ts
this.route.get(
  "/organizer/proof/:id",
  verifyToken,
  verifyRole([RoleType.ORGANIZER]),
  this.transactionController.getTransactionPaymentProof
);
```

- Controller: `src/controllers/transaction.controller.ts` → `getTransactionPaymentProof`

```236:255:src/controllers/transaction.controller.ts
public async getTransactionPaymentProof(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = res.locals.decrypt?.id;
    if (!userId) throw new Error("Unauthorized");

    const { id } = req.params;
    const transaction =
      await TransactionService.getTransactionPaymentProofService(
        Number(id),
        userId
      );

    res.status(200).json({ success: true, transaction });
  } catch (error) {
    next(error);
  }
}
```

- Service: `src/service/transaction.service.ts` → `getTransactionPaymentProofService`

```294:302:src/service/transaction.service.ts
public static async getTransactionPaymentProofService(
  transactionId: number,
  organizerId: number
) {
  return TransactionRepository.getTransactionPaymentProofRepo(
    transactionId,
    organizerId
  );
}
```

### GET /organizer/stats → Get Transaction Statistics

- Router: `src/routers/transaction.router.ts` → `getOrganizerTransactionStats`

```93:98:src/routers/transaction.router.ts
this.route.get(
  "/organizer/stats",
  verifyToken,
  verifyRole([RoleType.ORGANIZER]),
  this.transactionController.getOrganizerTransactionStats
);
```

- Controller: `src/controllers/transaction.controller.ts` → `getOrganizerTransactionStats`

```261:276:src/controllers/transaction.controller.ts
public async getOrganizerTransactionStats(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = res.locals.decrypt?.id;
    if (!userId) throw new Error("Unauthorized");

    const stats =
      await TransactionService.getOrganizerTransactionStatsService(userId);

    res.status(200).json({ success: true, stats });
  } catch (error) {
    next(error);
  }
}
```

- Service: `src/service/transaction.service.ts` → `getOrganizerTransactionStatsService`

```304:332:src/service/transaction.service.ts
public static async getOrganizerTransactionStatsService(organizerId: number) {
  const allTransactions =
    await TransactionRepository.getOrganizerTransactionsRepo(organizerId);

  const stats = {
    total: allTransactions.length,
    waiting_confirmation: 0,
    success: 0,
    rejected: 0,
    expired: 0,
    cancelled: 0,
    total_revenue: 0,
    pending_revenue: 0,
  };

  allTransactions.forEach((transaction) => {
    stats[transaction.status.toLowerCase() as keyof typeof stats]++;

    if (transaction.status === $Enums.PaymentStatusType.SUCCESS) {
      stats.total_revenue += transaction.total_price;
    } else if (
      transaction.status === $Enums.PaymentStatusType.WAITING_CONFIRMATION
    ) {
      stats.pending_revenue += transaction.total_price;
    }
  });

  return stats;
}
```

---

## Event Management API

- Base Path: `/api/events`

### POST /create → Create Event (Organizer Only)

- Router: `src/routers/event.router.ts` → `createEvent`

```21:28:src/routers/event.router.ts
this.route.post(
  "/create",
  verifyToken,
  verifyRole([RoleType.ORGANIZER]),
  upload.single("event_thumbnail"),
  this.eventController.createEvent
);
```

- Controller: `src/controllers/event.controller.ts` → `createEvent`

```15:36:src/controllers/event.controller.ts
public async createEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const user = res.locals.decrypt;
    let body = req.body;

    // convert stringified JSON back into an array/object
    if (body.tickets && typeof body.tickets === "string") {
      body.tickets = JSON.parse(body.tickets);
    }

    // upload thumbnail to cloudinary
    if (req.file) {
      const result = await cloudinaryUpload(req.file);
      body.event_thumbnail = result.secure_url;
    }
    const newEvent = await createEventService(user, body);

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: newEvent,
    });
  } catch (error: any) {
    next(error);
  }
}
```

- Service: `src/service/event.service.ts` → `createEventService`

```14:29:src/service/event.service.ts
export const createEventService = async (user: any, data: any) => {
  if (!user) throw { status: 401, message: "Unauthorized" };

  if (user.role !== "ORGANIZER") {
    throw { status: 403, message: "Only organizer can create events" };
  }

  if (!data.event_name || !data.event_start_date || !data.event_end_date) {
    throw { status: 400, message: "Missing required event fields" };
  }

  if (!Array.isArray(data.tickets) || data.tickets.length === 0) {
    throw { status: 400, message: "Event must have at least one ticket type" };
  }

  return createEventRepo(user.id, data);
};
```

### GET / → Get All Events (Public)

- Router: `src/routers/event.router.ts` → `getAllEvent`

```30:32:src/routers/event.router.ts
// get all events (public)
this.route.get("/", this.eventController.getAllEvent);
```

- Controller: `src/controllers/event.controller.ts` → `getAllEvent`

```42:52:src/controllers/event.controller.ts
public async getAllEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const { category } = req.query;

    const events = await getEventsService(category as string | undefined);

    return res.status(200).json({
      success: true,
      message: "Events retrieved successfully",
      data: events,
    });
  } catch (error: any) {
    next(error);
  }
}
```

- Service: `src/service/event.service.ts` → `getEventsService`

```32:34:src/service/event.service.ts
export const getEventsService = async (category?: string) => {
  return findAllEventsRepo(category);
};
```

### GET /detail/:title → Get Event by Title (Public)

- Router: `src/routers/event.router.ts` → `getEventByTitle`

```65:67:src/routers/event.router.ts
// get detail event (public) - HARUS DI BAWAH /organizer
this.route.get("/detail/:title", this.eventController.getEventByTitle);
```

- Controller: `src/controllers/event.controller.ts` → `getEventByTitle`

```58:78:src/controllers/event.controller.ts
public async getEventByTitle(
  req: Request<{ title: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { title } = req.params;

    if (!title || typeof title !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid title" });
    }

    const event = await getEventByTitleService(title);

    return res.status(200).json({
      success: true,
      message: "Event retrieved successfully",
      data: event,
    });
  } catch (error: any) {
    next(error);
  }
}
```

- Service: `src/service/event.service.ts` → `getEventByTitleService`

```36:40:src/service/event.service.ts
export const getEventByTitleService = async (title: string) => {
  const event = await findEventByTitleRepo(title);
  if (!event) throw { status: 404, message: "Event not found" };
  return event;
};
```

### GET /organizer → Get Events by Organizer (Organizer Only)

- Router: `src/routers/event.router.ts` → `getEventsByOrganizer`

```41:47:src/routers/event.router.ts
this.route.get(
  "/organizer",
  verifyToken,
  verifyRole([RoleType.ORGANIZER]),
  this.eventController.getEventsByOrganizer
);
```

- Controller: `src/controllers/event.controller.ts` → `getEventsByOrganizer`

```84:97:src/controllers/event.controller.ts
public async getEventsByOrganizer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = res.locals.decrypt;
    const events = await getEventsByOrganizerService(user.id);

    return res.status(200).json({
      success: true,
      message: "Organizer events retrieved successfully",
      data: events,
    });
  } catch (error: any) {
    next(error);
  }
}
```

- Service: `src/service/event.service.ts` → `getEventsByOrganizerService`

```42:44:src/service/event.service.ts
export const getEventsByOrganizerService = async (userId: number) => {
  return findEventsByOrganizerRepo(userId);
};
```

### GET /organizer/stats → Get Organizer Stats (Organizer Only)

- Router: `src/routers/event.router.ts` → `getOrganizerStats`

```49:55:src/routers/event.router.ts
this.route.get(
  "/organizer/stats",
  verifyToken,
  verifyRole([RoleType.ORGANIZER]),
  this.eventController.getOrganizerStats
);
```

- Controller: `src/controllers/event.controller.ts` → `getOrganizerStats`

```103:116:src/controllers/event.controller.ts
public async getOrganizerStats(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = res.locals.decrypt;
    const stats = await getOrganizerStatsService(user.id);

    return res.status(200).json({
      success: true,
      message: "Organizer statistics retrieved successfully",
      data: stats,
    });
  } catch (error: any) {
    next(error);
  }
}
```

- Service: `src/service/event.service.ts` → `getOrganizerStatsService`

```46:48:src/service/event.service.ts
export const getOrganizerStatsService = async (userId: number) => {
  return getOrganizerStatsRepo(userId);
};
```

### GET /organizer/transactions → Get Organizer Transactions (Organizer Only)

- Router: `src/routers/event.router.ts` → `getOrganizerTransactions`

```57:63:src/routers/event.router.ts
this.route.get(
  "/organizer/transactions",
  verifyToken,
  verifyRole([RoleType.ORGANIZER]),
  this.eventController.getOrganizerTransactions
);
```

- Controller: `src/controllers/event.controller.ts` → `getOrganizerTransactions`

```122:135:src/controllers/event.controller.ts
public async getOrganizerTransactions(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = res.locals.decrypt;
    const transactions = await getOrganizerTransactionsService(user.id);

    return res.status(200).json({
      success: true,
      message: "Organizer transactions retrieved successfully",
      data: transactions,
    });
  } catch (error: any) {
    next(error);
  }
}
```

- Service: `src/service/event.service.ts` → `getOrganizerTransactionsService`

```50:52:src/service/event.service.ts
export const getOrganizerTransactionsService = async (userId: number) => {
  return getOrganizerTransactionsRepo(userId);
};
```

### PATCH /edit/:id → Update Event (Organizer Only)

- Router: `src/routers/event.router.ts` → `updateEvent`

```68:74:src/routers/event.router.ts
this.route.patch(
  "/edit/:id",
  verifyToken,
  verifyRole([RoleType.ORGANIZER]),
  this.eventController.updateEvent
);
```

- Controller: `src/controllers/event.controller.ts` → `updateEvent`

```141:157:src/controllers/event.controller.ts
public async updateEvent(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id))
      return res.status(400).json({ success: false, message: "Invalid ID" });

    const updatedEvent = await updateEventService(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (error: any) {
    next(error);
  }
}
```

- Service: `src/service/event.service.ts` → `updateEventService`

```54:56:src/service/event.service.ts
export const updateEventService = async (id: number, data: any) => {
  return updateEventRepo(id, data);
};
```

### DELETE /delete/:id → Delete Event (Organizer Only)

- Router: `src/routers/event.router.ts` → `deleteEvent`

```76:82:src/routers/event.router.ts
this.route.delete(
  "/delete/:id",
  verifyToken,
  verifyRole([RoleType.ORGANIZER]),
  this.eventController.deleteEvent
);
```

- Controller: `src/controllers/event.controller.ts` → `deleteEvent`

```163:179:src/controllers/event.controller.ts
public async deleteEvent(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id))
      return res.status(400).json({ success: false, message: "Invalid ID" });

    const user = res.locals.decrypt;
    await deleteEventService(user, id);

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error: any) {
    next(error);
  }
}
```

- Service: `src/service/event.service.ts` → `deleteEventService`

```58:74:src/service/event.service.ts
export const deleteEventService = async (user: any, eventId: number) => {
  const event = await findEventByIdRepo(eventId);
  if (!event) throw { status: 404, message: "Event not found" };

  if (user.role === "ORGANIZER") {
    const organizer = await prisma.eventOrganizer.findUnique({
      where: { user_id: user.id },
    });
    if (!organizer || organizer.id !== event.event_organizer_id)
      throw {
        status: 403,
        message: "You are not allowed to delete this event",
      };
  }

  return deleteEventRepo(eventId);
};
```

---

Catatan:

- Middleware auth dan role: `verifyToken`, `verifyRole([RoleType.ORGANIZER])` digunakan pada endpoint yang membutuhkan akses organizer.
- Upload file: Menggunakan `multer.memoryStorage()` di router dan `cloudinaryUpload` di controller/service.
- Layanan database: Melalui repository di layer service.
