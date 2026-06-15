export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      departments: {
        Row: {
          id: string;
          name: string;
          code: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: "student" | "teacher" | "admin";
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          role?: "student" | "teacher" | "admin";
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          role?: "student" | "teacher" | "admin";
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      students: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          department_id: string | null;
          semester: number;
          fee_status: "Paid" | "Pending" | "Overdue";
          status: "Active" | "Hold" | "On Leave";
          gpa: number | null;
          credits_completed: number;
          credits_required: number;
          cnic: string | null;
          email: string | null;
          phone: string | null;
          date_of_birth: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          user_id?: string | null;
          name: string;
          department_id?: string | null;
          semester?: number;
          fee_status?: "Paid" | "Pending" | "Overdue";
          status?: "Active" | "Hold" | "On Leave";
          gpa?: number | null;
          credits_completed?: number;
          credits_required?: number;
          cnic?: string | null;
          email?: string | null;
          phone?: string | null;
          date_of_birth?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          name?: string;
          department_id?: string | null;
          semester?: number;
          fee_status?: "Paid" | "Pending" | "Overdue";
          status?: "Active" | "Hold" | "On Leave";
          gpa?: number | null;
          credits_completed?: number;
          credits_required?: number;
          cnic?: string | null;
          email?: string | null;
          phone?: string | null;
          date_of_birth?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      teachers: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          department_id: string | null;
          courses_count: number;
          status: "Active" | "Hold" | "On Leave";
          cnic: string | null;
          email: string | null;
          phone: string | null;
          date_of_birth: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          user_id?: string | null;
          name: string;
          department_id?: string | null;
          courses_count?: number;
          status?: "Active" | "Hold" | "On Leave";
          cnic?: string | null;
          email?: string | null;
          phone?: string | null;
          date_of_birth?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          name?: string;
          department_id?: string | null;
          courses_count?: number;
          status?: "Active" | "Hold" | "On Leave";
          cnic?: string | null;
          email?: string | null;
          phone?: string | null;
          date_of_birth?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          name: string;
          credits: number;
          instructor_id: string | null;
          department_id: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          credits?: number;
          instructor_id?: string | null;
          department_id?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          credits?: number;
          instructor_id?: string | null;
          department_id?: string | null;
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      enrollments: {
        Row: {
          id: string;
          student_id: string;
          course_id: string;
          semester: string;
          enrolled_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          course_id: string;
          semester?: string;
          enrolled_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          course_id?: string;
          semester?: string;
          enrolled_at?: string;
        };
        Relationships: [];
      };
      attendance_records: {
        Row: {
          id: string;
          enrollment_id: string;
          total_classes: number;
          classes_attended: number;
          percentage: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          enrollment_id: string;
          total_classes?: number;
          classes_attended?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          enrollment_id?: string;
          total_classes?: number;
          classes_attended?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      fee_transactions: {
        Row: {
          id: string;
          student_id: string;
          transaction_date: string;
          description: string;
          payment_method: string | null;
          amount_pkr: number;
          status: "Paid" | "Pending" | "Overdue";
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          transaction_date: string;
          description: string;
          payment_method?: string | null;
          amount_pkr: number;
          status?: "Paid" | "Pending" | "Overdue";
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          transaction_date?: string;
          description?: string;
          payment_method?: string | null;
          amount_pkr?: number;
          status?: "Paid" | "Pending" | "Overdue";
          created_at?: string;
        };
        Relationships: [];
      };
      semester_fees: {
        Row: {
          id: string;
          student_id: string;
          semester: string;
          total_amount_pkr: number;
          amount_paid_pkr: number;
          due_date: string | null;
        };
        Insert: {
          id?: string;
          student_id: string;
          semester: string;
          total_amount_pkr: number;
          amount_paid_pkr?: number;
          due_date?: string | null;
        };
        Update: {
          id?: string;
          student_id?: string;
          semester?: string;
          total_amount_pkr?: number;
          amount_paid_pkr?: number;
          due_date?: string | null;
        };
        Relationships: [];
      };
      course_grades: {
        Row: {
          id: string;
          student_id: string;
          course_id: string;
          semester: string;
          grade: string;
          grade_points: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          course_id: string;
          semester: string;
          grade: string;
          grade_points: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          course_id?: string;
          semester?: string;
          grade?: string;
          grade_points?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: "fee" | "attendance" | "course" | "announcement";
          title: string;
          body: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: "fee" | "attendance" | "course" | "announcement";
          title: string;
          body: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: "fee" | "attendance" | "course" | "announcement";
          title?: string;
          body?: string;
          read?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      fee_status: "Paid" | "Pending" | "Overdue";
      person_status: "Active" | "Hold" | "On Leave";
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T];
