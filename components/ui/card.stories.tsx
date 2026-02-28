import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const meta = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Executive Summary</CardTitle>
        <CardDescription>Q1 strategy performance snapshot</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Revenue grew 12% quarter-over-quarter, led by enterprise expansion.
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm">View detail</Button>
      </CardFooter>
    </Card>
  ),
};

